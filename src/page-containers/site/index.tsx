import React from "react";

const Site = () => {
  return (
    <main>
      <div className="min-h-screen flex flex-col  items-center pt-36 relative ">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <p>Run your agency,in one place</p>
        <div className="text-transparent bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Plural
          </h1>
        </div>
      </div>
    </main>
  );
};

export default Site;
