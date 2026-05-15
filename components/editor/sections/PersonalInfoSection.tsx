import type { CV } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormField from "../shared/FormField";

type Props = { cv: CV; onUpdate: (cv: CV) => void };

export default function PersonalInfoSection({ cv, onUpdate }: Props) {
  const set =
    (field: keyof typeof cv) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onUpdate({ ...cv, [field]: e.target.value || undefined });
    };

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Name">
        <Input value={cv.name ?? ""} onChange={set("name")} />
      </FormField>
      <FormField label="Job Title">
        <Input
          value={cv.title ?? ""}
          onChange={set("title")}
          placeholder="e.g. Software Developer"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email">
          <Input value={cv.email ?? ""} onChange={set("email")} />
        </FormField>
        <FormField label="Phone">
          <Input value={cv.phone ?? ""} onChange={set("phone")} />
        </FormField>
        <FormField label="Location">
          <Input value={cv.location ?? ""} onChange={set("location")} />
        </FormField>
        <FormField label="Website">
          <Input value={cv.website ?? ""} onChange={set("website")} />
        </FormField>
        <FormField label="LinkedIn">
          <Input value={cv.linkedin ?? ""} onChange={set("linkedin")} />
        </FormField>
        <FormField label="GitHub">
          <Input value={cv.github ?? ""} onChange={set("github")} />
        </FormField>
        <FormField label="Driver's License">
          <Input value={cv.driverLicense ?? ""} onChange={set("driverLicense")} />
        </FormField>
        <FormField label="Date of Birth">
          <Input value={cv.dateOfBirth ?? ""} onChange={set("dateOfBirth")} />
        </FormField>
      </div>
      <FormField label="Summary">
        <Textarea value={cv.summary ?? ""} onChange={set("summary")} rows={4} />
      </FormField>
    </div>
  );
}
