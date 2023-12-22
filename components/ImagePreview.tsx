import { useState } from "react";
import { Image } from "../types/image";
export const ImagePreview = (props: { image: Image }) => {
  const [size, setSize] = useState(200);
  return (
    <>
      {props.image.ref || props.image.name}
      <img
        height={size}
        width={size}
        onMouseEnter={() => setSize(800)}
        onMouseLeave={() => setSize(200)}
        src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/${props.image.path}`}
      />
    </>
  );
};
