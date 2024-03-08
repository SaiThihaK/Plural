const page = ({ params }: { params: { agencyId: string } }) => {
  return <div>AgencyId:${params.agencyId}</div>;
};

export default page;
