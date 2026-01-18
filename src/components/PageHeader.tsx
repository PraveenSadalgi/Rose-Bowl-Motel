import type { FC } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-balance">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl mx-auto text-lg text-balance">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
