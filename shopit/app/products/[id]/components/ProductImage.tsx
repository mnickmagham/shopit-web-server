import React from "react";

export default function ProductImage({
  images,
}: {
  images: string[];
}) {
  const [src, setSrc] = React.useState(images[0]);
  const [hidden, setHidden] = React.useState(false);

  const onError = () => {
    const currentIndex = images.indexOf(src);
    const nextIndex = currentIndex + 1;
    if (nextIndex < images.length) {
      setSrc(images[nextIndex]);
      setHidden(false);
    } else {
      setHidden(true);
    }
  };

  return (
    <div className="w-full md:w-1/2 p-4">
      {!hidden && (
        <img
          src={src}
          alt="product picture"
          className="h-3/4 object-cover w-full"
          onError={onError}
        />
      )}
    </div>
  );
}
