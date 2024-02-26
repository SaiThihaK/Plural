import Image from "next/image";

const Site = () => {
  return (
    <main>
      <section className="min-h-screen flex flex-col  items-center pt-36 relative ">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <p>Run your agency,in one place</p>
        <div className="text-transparent bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Plural
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src="/assets/preview.png"
            alt="banner image"
            width={1200}
            height={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
        </div>
        <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
      </section>
      <section className="flex flex-col gap-4 md:mt-20">
        <h2 className="text-4xl text-center">Choose what fits your right</h2>
        <p className="text-muted-foregroundt text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not <br />
          ready to commit you can get started for free.
        </p>
      </section>
    </main>
  );
};

export default Site;