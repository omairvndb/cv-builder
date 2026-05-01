import type { CV } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormField from "../shared/FormField";

type Props = { cv: CV; onUpdate: (cv: CV) => void };

type RequiredField = "name" | "email" | "phone" | "location";
type OptionalField =
  | "title"
  | "website"
  | "linkedin"
  | "github"
  | "driverLicense"
  | "dateOfBirth"
  | "summary";

export default function PersonalInfoSection({ cv, onUpdate }: Props) {
  const setRequired =
    (field: RequiredField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onUpdate({ ...cv, [field]: e.target.value });
    };

  const setOptional =
    (field: OptionalField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onUpdate({ ...cv, [field]: e.target.value || undefined });
    };

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Name">
        <Input value={cv.name} onChange={setRequired("name")} />
      </FormField>
      <FormField label="Job Title">
        <Input
          value={cv.title ?? ""}
          onChange={setOptional("title")}
          placeholder="e.g. Software Developer"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email">
          <Input value={cv.email} onChange={setRequired("email")} />
        </FormField>
        <FormField label="Phone">
          <Input value={cv.phone} onChange={setRequired("phone")} />
        </FormField>
        <FormField label="Location">
          <Input value={cv.location} onChange={setRequired("location")} />
        </FormField>
        <FormField label="Website">
          <Input value={cv.website ?? ""} onChange={setOptional("website")} />
        </FormField>
        <FormField label="LinkedIn">
          <Input value={cv.linkedin ?? ""} onChange={setOptional("linkedin")} />
        </FormField>
        <FormField label="GitHub">
          <Input value={cv.github ?? ""} onChange={setOptional("github")} />
        </FormField>
        <FormField label="Driver's License">
          <Input value={cv.driverLicense ?? ""} onChange={setOptional("driverLicense")} />
        </FormField>
        <FormField label="Date of Birth">
          <Input value={cv.dateOfBirth ?? ""} onChange={setOptional("dateOfBirth")} />
        </FormField>
      </div>
      <FormField label="Summary">
        <Textarea value={cv.summary ?? ""} onChange={setOptional("summary")} rows={4} />
      </FormField>
    </div>
  );
}
