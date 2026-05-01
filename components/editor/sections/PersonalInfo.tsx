import type { CV } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = { cv: CV; onUpdate: (cv: CV) => void };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default function PersonalInfo({ cv, onUpdate }: Props) {
  const set =
    (field: keyof CV, optional = false) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      onUpdate({ ...cv, [field]: optional ? value || undefined : value } as CV);
    };

  return (
    <div className="flex flex-col gap-3">
      <Field label="Name">
        <Input value={cv.name} onChange={set("name")} />
      </Field>
      <Field label="Job Title">
        <Input
          value={cv.title ?? ""}
          onChange={set("title", true)}
          placeholder="e.g. Software Developer"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email">
          <Input value={cv.email} onChange={set("email")} />
        </Field>
        <Field label="Phone">
          <Input value={cv.phone} onChange={set("phone")} />
        </Field>
        <Field label="Location">
          <Input value={cv.location} onChange={set("location")} />
        </Field>
        <Field label="Website">
          <Input value={cv.website ?? ""} onChange={set("website", true)} />
        </Field>
        <Field label="LinkedIn">
          <Input value={cv.linkedin ?? ""} onChange={set("linkedin", true)} />
        </Field>
        <Field label="GitHub">
          <Input value={cv.github ?? ""} onChange={set("github", true)} />
        </Field>
        <Field label="Driver's License">
          <Input value={cv.driverLicense ?? ""} onChange={set("driverLicense", true)} />
        </Field>
        <Field label="Date of Birth">
          <Input value={cv.dateOfBirth ?? ""} onChange={set("dateOfBirth", true)} />
        </Field>
      </div>
      <Field label="Summary">
        <Textarea value={cv.summary ?? ""} onChange={set("summary", true)} rows={4} />
      </Field>
    </div>
  );
}
