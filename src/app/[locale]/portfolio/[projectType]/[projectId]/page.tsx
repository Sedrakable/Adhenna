import { projectPageQuery } from "@/app/api/generateSanityQueries";
import { fetchPageData } from "@/app/api/useFetchPage";
import { CanvasModal } from "@/components/pages/blocks/Projects/CanvasModal";
import { FlashModal } from "@/components/pages/blocks/Projects/FlashModal";
import { ProjectModal } from "@/components/pages/blocks/Projects/ProjectModal";
import { ICanvas, IFlash, IProject, LocalPaths, ProjectType } from "@/data.d";
import { getWorkPageData, WorkPageProps } from "../page";
import { getFormData } from "@/components/reuse/Form/getFormData";
import { FormTitleProps } from "@/components/reuse/Form/Form";
import { Modal } from "@/components/reuse/Modal";
import { setMetadata } from "@/components/SEO";
import { LangType } from "@/i18n/request";
import { Metadata } from "next";

const getProjectData = async (type: string, id: string) => {
  const getProjectQuery = projectPageQuery(type, id);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const projectData: IProject = await fetchPageData(getProjectQuery);

  return projectData;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string; projectType: string; locale: LangType }>;
}): Promise<Metadata> {
  const { projectId, projectType, locale } = await params;
  const projectData: IProject = await getProjectData(projectType, projectId);
  const path = LocalPaths.COURSE + LocalPaths.ONLINE;
  const crawl = false;
  return setMetadata({
    locale,
    metaTitle: projectData.image.alt,
    metaDesc: projectData.image.alt,
    path,
    crawl,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string; projectType: string; locale: LangType }>;
}) {
  const { projectId, projectType, locale } = await params;
  const formData: FormTitleProps = await getFormData(
    projectType as ProjectType,
    locale
  );
  const selectedProject: IProject = await getProjectData(
    projectType,
    projectId
  );
  console.log("selectedProject", selectedProject);
  return (
    <Modal
      version={
        (projectType === "flash" || projectType === "toiles") &&
        !(selectedProject as IFlash | ICanvas).reserved
          ? "default"
          : "image"
      }
    >
      {projectType === "flash" ? (
        formData && (
          <FlashModal project={selectedProject as IFlash} formData={formData} />
        )
      ) : projectType === "toiles" && !(selectedProject as ICanvas).reserved ? (
        <CanvasModal project={selectedProject as ICanvas} />
      ) : (
        <ProjectModal project={selectedProject} />
      )}
    </Modal>
  );
}
