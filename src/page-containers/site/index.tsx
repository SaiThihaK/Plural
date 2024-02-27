import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-1"></div>
        </div>
      </section>
      <section className="flex flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center">Choose what fits your right</h2>
        <p className="text-muted-foregroundt text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not <br />
          ready to commit you can get started for free.
        </p>
        <div className="flex justify-center  mt-6 gap-4 flex-wrap">
          {pricingCards.map((card) => (
            <Card
              key={card.title}
              className={clsx(" w-[300px] flex justify-between flex-col", {
                "border-2 border-primary": card.title === "Unlimited Saas",
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx("", {
                    "text-muted-foreground": card.title !== "Unlimited Saas",
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <span className="text-4xl font-bold">{card.price}</span>
                <span className="text-muted-foreground">/m</span>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 items-start">
                <div>
                  {card.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check />
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className={clsx(
                    "bg-primary w-full text-center p-2 rounded-md",
                    {
                      "!bg-muted-foreground": card.title !== "Unlimited Saas",
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Site;
