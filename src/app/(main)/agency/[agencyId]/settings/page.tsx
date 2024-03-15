import SettingPage from "@/page-containers/site/settings";

const page = ({ params }: { params: { agencyId: string } }) => {
  return <SettingPage agecnyId={params.agencyId} />;
};

export default page;
