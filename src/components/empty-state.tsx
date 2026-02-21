import Image from 'next/image';

type EmptyStateProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageHint: string;
  children?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  imageSrc,
  imageAlt,
  imageHint,
  children,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-6">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={200}
          height={150}
          data-ai-hint={imageHint}
          className="rounded-lg"
        />
      </div>
      <h2 className="text-2xl font-bold font-headline">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
