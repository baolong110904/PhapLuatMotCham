"use client";

import NextImage, { ImageProps } from 'next/image';

type Props = ImageProps & {
  // allow opt-in to force different defaults if needed later
  qualityOverride?: number;
};

export default function OptimizedImage({ qualityOverride, sizes, priority, loading, fetchPriority, ...rest }: Props) {
  // sensible defaults for mobile/4G
  const quality = qualityOverride ?? 75; // reduce payload while keeping decent quality
  const resolvedSizes = sizes ?? '(max-width: 768px) 100vw, 50vw';
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');
  const resolvedFetchPriority = fetchPriority ?? (priority ? 'high' : 'auto');

  return (
    <NextImage
      {...rest}
      quality={quality}
      sizes={resolvedSizes}
      loading={resolvedLoading}
      fetchPriority={resolvedFetchPriority}
    />
  );
}
