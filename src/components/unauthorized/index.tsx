import Link from "next/link";

type Props = {};

const Unauthorized = (props: Props) => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">Unauthorized acccess!</h1>
      <p>Please contact support or your agency owner to get access</p>
      <Link href="/" className="mt-4 bg-primary p-2 px-4 rounded-xl">
        Back to home
      </Link>
    </div>
  );
};

export default Unauthorized;