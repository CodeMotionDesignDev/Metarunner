// import { MouseEvent } from "react"; element for dynamic type checking of handlePointerMove function
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
const Login = () => {
  //code for animation
  //   const [isHovered, setIsHovered] = useState(false);
  //   const handleHover = () => {
  //     setIsHovered(true);
  //   };

  //   const handleAnimationEnd = () => {
  //     setIsHovered(false);
  //   };

  //code for dynamic gradient background
  const handlePointerMove = (e: any) => {
    const { currentTarget: el, clientX: x, clientY: y } = e;
    const { top: t, left: l, width: w, height: h } = el.getBoundingClientRect();
    el.style.setProperty("--posX", x - l - w / 2);
    el.style.setProperty("--posY", y - t - h / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: [1, 1.5, 1] }}
      whileInView={{ opacity: 1 }}
      transition={{ ease: "easeInOut", z: { duration: 10 } }}
      className="relative gradientBackground"
      onPointerMove={handlePointerMove}
    >
      <Image
        src="/loginBG.svg"
        alt="Logo"
        width={200}
        height={200}
        className="h-screen w-screen mx-auto"
      />
      <div className="flex flex-col space-y-6 absolute top-[40%] left-1/4 md:left-1/3 lg:top-[36%] lg:left-[40%] xl:left-[42%]">
        <Image
          src={"/nrcBTN.svg"}
          alt="nikebutton"
          width={100}
          height={100}
          className="lg:w-60 xl:w-72 xl:hover:w-80 lg:hover:w-64 hover:animate-ping delay-1000"
        />
        <Image
          src={"/stravaBTN.svg"}
          alt="nikebutton"
          width={100}
          height={100}
          className="lg:w-60 xl:w-72 hover:w-80 hover:animate-ping delay-1000"
        />
        <Image
          src={"/mapMyRunBTN.svg"}
          alt="nikebutton"
          width={100}
          height={100}
          className="lg:w-60 xl:w-72 hover:w-80 hover:animate-ping delay-1000"
        />
        <Image
          src={"/adidasBTN.svg"}
          alt="nikebutton"
          width={100}
          height={100}
          className="lg:w-60 xl:w-72 hover:w-80 hover:animate-ping delay-1000"
        />
        <h2 className="text-xl lg:relative lg:right-4 xl:block xl:right-0 font-normal">
          sign up here for latest news
        </h2>
        <Image
          src={"/shareBTN.svg"}
          alt="nikebutton"
          width={100}
          height={100}
          className="lg:w-60 xl:w-72 hover:w-80 hover:animate-ping delay-1000"
        />
      </div>
    </motion.div>
  );
};

export default Login;
