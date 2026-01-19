import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

type Booking = {
  id: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  payment_intent_id: string;
  created_at: string;
};

export async function generateBookingPdf(booking: Booking): Promise<Uint8Array> {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 2 * margin;
  
  // Add logo or header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Rose Bowl Motel', margin, margin + 10);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Ocean View Drive, Beachside, CA 90210', margin, margin + 20);
  doc.text('Phone: (555) 123-4567 | Email: info@rosebowlmotel.com', margin, margin + 28);
  
  // Add a line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, margin + 35, pageWidth - margin, margin + 35);
  
  // Booking details header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOKING CONFIRMATION', margin, margin + 50);
  
  // Booking info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Left column
  doc.text(`Booking #: ${booking.id.split('-')[0].toUpperCase()}`, margin, margin + 70);
  doc.text(`Booking Date: ${format(new Date(booking.created_at), 'MMM d, yyyy')}`, margin, margin + 80);
  doc.text(`Status: Confirmed`, margin, margin + 90);
  
  // Right column
  doc.text(`Guest: ${booking.guest_name}`, margin + 100, margin + 70);
  doc.text(`Email: ${booking.guest_email}`, margin + 100, margin + 80);
  doc.text(`Phone: ${booking.guest_phone}`, margin + 100, margin + 90);
  
  // Room details
  doc.setFont('helvetica', 'bold');
  doc.text('ROOM DETAILS', margin, margin + 115);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Room Type: ${booking.room_type}`, margin, margin + 125);
  doc.text(`Check-in: ${format(new Date(booking.check_in_date), 'EEEE, MMMM d, yyyy')}`, margin, margin + 135);
  doc.text(`Check-out: ${format(new Date(booking.check_out_date), 'EEEE, MMMM d, yyyy')}`, margin, margin + 145);
  
  // Payment summary
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT SUMMARY', margin, margin + 170);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Amount: ₹${booking.total_price.toLocaleString('en-IN')}`, margin, margin + 180);
  doc.text(`Payment Method: Credit Card`, margin, margin + 190);
  doc.text(`Payment ID: ${booking.payment_intent_id}`, margin, margin + 200);
  
  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing Rose Bowl Motel!', margin, 280);
  doc.text('Please present this confirmation upon arrival.', margin, 286);
  
  // Add a border
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin - 5, margin - 5, pageWidth - 2 * margin + 10, 280 - margin + 10);
  
  // @ts-ignore - jsPDF types are not perfect
  return doc.output('arraybuffer');
}
