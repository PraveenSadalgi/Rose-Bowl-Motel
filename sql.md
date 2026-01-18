# Rose Bowl Motel - Database Schema

## Tables Setup

```sql
-- Enable UUID extension for unique identifiers
create extension if not exists "uuid-ossp";

-- Create enum types
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');

-- Rooms table
create table if not exists rooms (
  id bigint primary key,
  name varchar(100) not null,
  slug varchar(100) not null unique,
  description text,
  long_description text,
  price_per_night numeric(10, 2) not null,
  capacity integer not null,
  sqft integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Amenities table
create table if not exists amenities (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null unique,
  icon varchar(50),
  created_at timestamp with time zone default now()
);

-- Room amenities junction table
create table if not exists room_amenities (
  room_id bigint references rooms(id) on delete cascade,
  amenity_id uuid references amenities(id) on delete cascade,
  primary key (room_id, amenity_id)
);

-- Bookings table
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  room_id bigint not null references rooms(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  first_name varchar(100) not null,
  last_name varchar(100) not null,
  email varchar(255) not null,
  phone varchar(50) not null,
  check_in_date date not null,
  check_out_date date not null,
  num_guests integer not null,
  status booking_status not null default 'pending',
  total_amount numeric(10, 2) not null,
  currency varchar(3) not null default 'USD',
  special_requests text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint valid_dates check (check_out_date > check_in_date),
  constraint valid_guests check (num_guests > 0)
);

-- Payments table
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  amount_paid numeric(10, 2) not null,
  payment_status payment_status not null default 'pending',
  receipt_url text,
  currency varchar(3) not null default 'USD',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Room availability (blocked dates)
create table if not exists room_availability (
  id uuid primary key default uuid_generate_v4(),
  room_id bigint not null references rooms(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  date date not null,
  is_blocked boolean not null default true,
  reason varchar(255),
  created_at timestamp with time zone default now(),
  constraint unique_room_date unique (room_id, date)
);

-- Function to check room availability
create or replace function check_room_availability(
  p_room_id bigint,
  p_check_in_date date,
  p_check_out_date date
) returns boolean as $$
declare
  v_is_available boolean;
begin
  select not exists (
    select 1 
    from room_availability 
    where room_id = p_room_id 
      and date >= p_check_in_date 
      and date < p_check_out_date
      and is_blocked = true
  ) into v_is_available;
  
  return v_is_available;
end;
$$ language plpgsql security definer;

-- Function to block room dates for a booking
create or replace function block_room_dates()
returns trigger as $$
begin
  -- Insert blocked dates for the booking
  insert into room_availability (room_id, booking_id, date, is_blocked, reason)
  select 
    new.room_id, 
    new.id, 
    generate_series(
      new.check_in_date, 
      new.check_out_date - interval '1 day', 
      interval '1 day'
    )::date,
    true,
    'Reserved for booking ' || new.id
  on conflict (room_id, date) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to block room dates when a booking is created
create or replace trigger block_room_dates_trigger
after insert on bookings
for each row
execute function block_room_dates();

-- Function to check room availability before booking
create or replace function check_booking_availability()
returns trigger as $$
begin
  if not exists (
    select 1 
    from rooms 
    where id = new.room_id 
    and capacity >= new.num_guests
  ) then
    raise exception 'Room does not have enough capacity for the number of guests';
  end if;
  
  if not check_room_availability(new.room_id, new.check_in_date, new.check_out_date) then
    raise exception 'Room is not available for the selected dates';
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to check room availability before booking
create or replace trigger check_booking_availability_trigger
before insert on bookings
for each row
execute function check_booking_availability();

-- Create RLS policies for security
alter table rooms enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;
alter table room_availability enable row level security;

-- RLS policies for rooms
create policy "Allow public read access to rooms"
on rooms for select using (true);

-- RLS policies for bookings
create policy "Users can view their own bookings"
on bookings for select using (auth.uid() = user_id);

create policy "Users can create bookings"
on bookings for insert with check (true);

create policy "Admins can manage all bookings"
on bookings for all using (auth.role() = 'authenticated' and auth.jwt() ->> 'is_admin' = 'true');

-- RLS policies for payments
create policy "Users can view their own payments"
on payments for select using (
  exists (
    select 1 from bookings 
    where bookings.id = payments.booking_id 
    and bookings.user_id = auth.uid()
  )
);

-- Create index for better performance
create index idx_room_availability_room_date on room_availability(room_id, date);
create index idx_bookings_room_dates on bookings(room_id, check_in_date, check_out_date);
create index idx_payments_booking_id on payments(booking_id);
```

## Initial Data Setup

```sql
-- Insert rooms
insert into rooms (id, name, slug, description, long_description, price_per_night, capacity, sqft)
values 
  (1, 'Deluxe King Room', 'deluxe-king-room', 'A spacious room with a comfortable king-sized bed.', 'Indulge in the comfort of our Deluxe King Room...', 199.99, 2, 450),
  (2, 'Executive Suite', 'executive-suite', 'A luxurious suite with a separate living area.', 'Experience unparalleled luxury in our Executive Suite...', 349.99, 3, 750),
  (3, 'Garden View Queen', 'garden-view-queen', 'A charming room with beautiful garden views.', 'Wake up to the serene views of our lush gardens...', 179.99, 2, 400)
on conflict (id) do nothing;

-- Insert amenities
insert into amenities (id, name, icon)
values 
  (gen_random_uuid(), 'WiFi', 'wifi'),
  (gen_random_uuid(), 'TV', 'tv'),
  (gen_random_uuid(), 'Coffee Maker', 'coffee'),
  (gen_random_uuid(), 'Air Conditioning', 'wind'),
  (gen_random_uuid(), 'Parking', 'parking-circle'),
  (gen_random_uuid(), 'Restaurant', 'utensils'),
  (gen_random_uuid(), 'Balcony', 'sun'),
  (gen_random_uuid(), 'Ocean View', 'waves'),
  (gen_random_uuid(), 'Bike Rental', 'bike'),
  (gen_random_uuid(), 'Gym', 'dumbbell'),
  (gen_random_uuid(), 'Spa', 'sparkles'),
  (gen_random_uuid(), 'Room Service', 'concierge-bell')
on conflict (name) do nothing;
```

## Usage Examples

### Check room availability
```sql
select * from check_room_availability(1, '2025-01-15', '2025-01-20');
```

### Create a new booking
```sql
with booking as (
  insert into bookings (
    room_id, 
    user_id, 
    first_name, 
    last_name, 
    email, 
    phone, 
    check_in_date, 
    check_out_date, 
    num_guests, 
    status, 
    total_amount,
    currency
  ) values (
    1,
    'user-uuid-here',
    'John',
    'Doe',
    'john@example.com',
    '+1234567890',
    '2025-01-15',
    '2025-01-20',
    2,
    'pending',
    999.95,
    'USD'
  )
  returning id, total_amount, currency
)
select id, total_amount, currency from booking;
```

### Update payment status after successful payment
```sql
update payments
set 
  payment_status = 'succeeded',
  receipt_url = 'https://example.com/receipt/...',
  updated_at = now()
where id = 'payment-id-here';

-- Update booking status to confirmed
update bookings
set 
  status = 'confirmed',
  updated_at = now()
where id = 'booking-uuid-here';
```
