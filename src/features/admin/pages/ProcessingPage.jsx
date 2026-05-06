import { useEffect } from "react";
import { appTheme } from "../../../app/theme";
import PageIntro from "../components/PageIntro";
import ProcessingSection from "../components/sections/ProcessingSection";
import { useAdminData } from "../context/AdminDataContext";

export default function ProcessingPage() {
  const { data, processForm, updateProcessForm, handleProcessSubmit } = useAdminData();
  const completedJobs = data.processing.filter((item) => item.processStatus === "Completed").length;

  useEffect(() => {
    document.title = `${appTheme.appTitle} | Processing`;
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Operations"
        title="Track internal work like packing, labeling, and delivery."
        description="Use this page to review live jobs and add the next operational step when work is created."
        tips={["Mark jobs completed when they are done.", "Use the cost field only for real operating cost."]}
        stats={[
          { label: "Jobs", value: data.processing.length },
          { label: "Completed", value: completedJobs },
        ]}
      />
      <ProcessingSection
        form={processForm}
        items={data.processing}
        onChange={updateProcessForm}
        onSubmit={handleProcessSubmit}
      />
    </>
  );
}
