// @ts-ignore
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { motion } from "motion/react";

import "@splidejs/react-splide/css";

import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";

const SlideShow = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState('')
  return (
    <>
      <Splide
        options={{
          autoplay: "true",
          perPage: 1,
          start: 0,
          rewind: true,
          padding: { left: "3rem", right: "3rem" },
          gap: "1rem",
        }}
        hasTrack={false}
      >
        <SplideTrack>
          {images.map((image, idx) => (
            <SplideSlide key={idx} className="flex items-center">
              <motion.button
                className="relative block w-full cursor-zoom-in"
                onClick={() => { setSelectedImage(image) }}
              //layout animation
              >
                <Image
                  src={image}
                  alt="screenshot"
                  width={1000}
                  height={1000}
                  className="w-full rounded-lg h-auto"
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 text-white/90 text-sm backdrop-blur-[2px]"
                  variants={{
                    idle: { opacity: 0 },
                    hover: { opacity: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Click to zoom
                </motion.div>
              </motion.button>
            </SplideSlide>
          ))}
        </SplideTrack>
        <div className="splide__progress">
          <div className="splide__progress__bar"></div>
        </div>
      </Splide>
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage('')}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent"
          onClick={() => setSelectedImage('')} >
          <DialogHeader className="sr-only">
            <DialogTitle>Screenshot</DialogTitle>
            <DialogDescription>Zoomed screenshot</DialogDescription>
          </DialogHeader>
          <motion.div>
            <Image
              src={selectedImage || ''}
              alt="screenshot"
              width={1080}
              height={1080}
              className="w-full rounded-lg h-auto max-h-[90vh]"
            />
          </motion.div>
        </DialogContent>
      </Dialog>
    </>

  );
};
export default SlideShow;
