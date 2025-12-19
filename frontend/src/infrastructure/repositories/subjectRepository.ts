import { CreateSubjectPayload, Subject } from "../../domain/models/Subject";

const SUBJECTS_API = "/api/v1/subjects";

const parseError = async (response: Response) => {
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    if (data?.message) {
      return data.message;
    }
  }
  return response.statusText || "Unexpected error";
};

const createSubject = async (payload: CreateSubjectPayload): Promise<Subject> => {
  const response = await fetch(SUBJECTS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

const getSubjects = async (): Promise<Subject[]> => {
  const response = await fetch(SUBJECTS_API, { credentials: "include" });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const subjectRepository = {
  createSubject,
  getSubjects
};
