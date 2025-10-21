// "use client";

// import React, { useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import emailjs from "@emailjs/browser";
// import { FormField } from "@/sharedComponent/FormField";

// /* ---------------- schema ---------------- */
// const leadSchema = z.object({
//   name: z.string().min(2, "Please enter your full name"),
//   phone: z.string().min(6, "Enter a valid phone number"),
//   email: z.string().email("Enter a valid email"),
//   company: z.string().min(2, "Company is required"),
//   message: z.string().min(5, "Please add a short message"),
// });
// export type LeadForm = z.infer<typeof leadSchema>;

// type SubmitType = "demo" | "partner";

// interface NavgationFormProps {
//   formId?: string;
//   type: SubmitType;
//   onSuccess?: (result: unknown) => void;
//   onSubmittingChange?: (submitting: boolean) => void;
//   showSubmitButton?: boolean;
//   submitLabel?: string;
// }

// /* ---------------- EmailJS (hardcoded) ----------------
//    NOTE: replace PUBLIC_KEY with your actual EmailJS public key
//    from Dashboard → Account → API Keys.
// ------------------------------------------------------ */
// const SERVICE_ID = "service_f2p8z6e";
// const TEMPLATE_ID = "template_04sbrw7";
// const PUBLIC_KEY  = "mxnMw5kD9r_8dLGMD";

// /* Optional: init once per page (harmless with sendForm) */
// let _emailjsInit = false;
// function ensureEmailJsInit() {
//   if (!_emailjsInit) {
//     if (!PUBLIC_KEY || PUBLIC_KEY.includes("REPLACE_WITH")) {
//       console.error("EmailJS PUBLIC_KEY is missing. Please set PUBLIC_KEY.");
//     } else {
//       emailjs.init(PUBLIC_KEY);
//     }
//     _emailjsInit = true;
//   }
// }

// export const NavgationForm: React.FC<NavgationFormProps> = ({
//   formId,
//   type,
//   onSuccess,
//   onSubmittingChange,
//   showSubmitButton = false,
//   submitLabel = "Submit",
// }) => {
//   const formRef = useRef<HTMLFormElement | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm<LeadForm>({
//     resolver: zodResolver(leadSchema),
//     defaultValues: { name: "", phone: "", email: "", company: "", message: "" },
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const watchName = watch("name");
//   const watchEmail = watch("email");

//   const setSubmittingBoth = (v: boolean) => {
//     setSubmitting(v);
//     onSubmittingChange?.(v);
//   };

//   const onSubmit = async () => {
//     if (!formRef.current) return;

//     if (!PUBLIC_KEY || PUBLIC_KEY.includes("REPLACE_WITH")) {
//       alert("EmailJS public key is missing. Please set PUBLIC_KEY in the component.");
//       return;
//     }

//     ensureEmailJsInit();

//     try {
//       setSubmittingBoth(true);

//       // Send the actual form DOM so EmailJS can read fields by name
//       const res = await emailjs.sendForm(
//         SERVICE_ID,
//         TEMPLATE_ID,
//         formRef.current,
//         PUBLIC_KEY
//       );

//       if (res.text === "OK") {
//         onSuccess?.({ ok: true, type });
//         reset();
//       } else {
//         throw new Error("Failed to send email");
//       }
//     } catch (e) {
//       const msg = e instanceof Error ? e.message : "Submission failed";
//       console.error(msg);
//       alert(msg);
//     } finally {
//       setSubmittingBoth(false);
//     }
//   };

//   return (
//     <form
//       id={formId}
//       ref={formRef}
//       className="space-y-4"
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <FormField
//         name="name"
//         label="Name"
//         placeholder="Jane Doe"
//         register={register}
//         error={errors.name?.message}
//       />

//       <FormField
//         name="phone"
//         type="tel"
//         label="Phone"
//         placeholder="+961 70 123 456"
//         register={register}
//         error={errors.phone?.message}
//       />

//       <FormField
//         name="email"
//         type="email"
//         label="Email"
//         placeholder="jane@company.com"
//         register={register}
//         error={errors.email?.message}
//       />

//       <FormField
//         name="company"
//         label="Company"
//         placeholder="Acme Inc."
//         register={register}
//         error={errors.company?.message}
//       />

//       <FormField
//         name="message"
//         label="Message"
//         placeholder="Tell us what you'd like to see."
//         textarea
//         rows={5}
//         register={register}
//         error={errors.message?.message}
//       />

//       {/* Hidden mirrors so the EmailJS template gets the SAME expected names */}
//       <input type="hidden" name="from_name" value={watchName || ""} readOnly />
//       <input type="hidden" name="from_email" value={watchEmail || ""} readOnly />
//       <input type="hidden" name="lead_type" value={type} readOnly />

//       {showSubmitButton && (
//         <button type="submit" className="hidden" disabled={submitting}>
//           {submitLabel}
//         </button>
//       )}
//     </form>
//   );
// };

// export default NavgationForm;
"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import { FormField } from "@/sharedComponent/FormField";

/* ---------------- schema ---------------- */
const leadSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(6, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Company is required"),
  message: z.string().min(5, "Please add a short message"),
});
export type LeadForm = z.infer<typeof leadSchema>;

type SubmitType = "demo" | "partner";

interface NavgationFormProps {
  formId?: string;
  type: SubmitType;
  onSuccess?: (result: unknown) => void;
  onSubmittingChange?: (submitting: boolean) => void;
  showSubmitButton?: boolean;
  submitLabel?: string;
}

/* ---------------- EmailJS config ---------------- */
const SERVICE_ID = "service_f2p8z6e";
const TEMPLATE_ID = "template_04sbrw7";
const PUBLIC_KEY  = "mxnMw5kD9r_8dLGMD";

/* ---------------- Recipients ---------------- */
const RECIPIENTS = {
  demo: ["alihjhsn57@gmail.com"], // send to one email
  partner: ["11830575@students.liu.edu.lb", "mac.softmachineco@gmail.com"], // send to two
};

export const NavgationForm: React.FC<NavgationFormProps> = ({
  formId,
  type,
  onSuccess,
  onSubmittingChange,
  showSubmitButton = false,
  submitLabel = "Submit",
}) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", company: "", message: "" },
  });

  const [sending, setSending] = useState(false);
  const watchName = watch("name");
  const watchEmail = watch("email");

  const setSubmittingBoth = (v: boolean) => {
    setSending(v);
    onSubmittingChange?.(v);
  };

  const onSubmit = async () => {
    if (!formRef.current) return;

    try {
      setSubmittingBoth(true);

      emailjs.init(PUBLIC_KEY);

      // pick recipients based on form type
      const toEmails = RECIPIENTS[type]?.join(",") || RECIPIENTS.demo.join(",");

      // add hidden field dynamically before sending
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "to_email";
      hiddenInput.value = toEmails;
      formRef.current.appendChild(hiddenInput);

      const res = await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );

      // remove hidden input afterward (cleanup)
      hiddenInput.remove();

      if (res.text === "OK") {
        onSuccess?.({ ok: true, type });
        reset();
      } else {
        throw new Error("Failed to send email");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      console.error(msg);
      alert(msg);
    } finally {
      setSubmittingBoth(false);
    }
  };

  return (
    <form
      id={formId}
      ref={formRef}
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        name="name"
        label="Name"
        placeholder="Jane Doe"
        register={register}
        error={errors.name?.message}
      />

      <FormField
        name="phone"
        type="tel"
        label="Phone"
        placeholder="+961 70 123 456"
        register={register}
        error={errors.phone?.message}
      />

      <FormField
        name="email"
        type="email"
        label="Email"
        placeholder="jane@company.com"
        register={register}
        error={errors.email?.message}
      />

      <FormField
        name="company"
        label="Company"
        placeholder="Acme Inc."
        register={register}
        error={errors.company?.message}
      />

      <FormField
        name="message"
        label="Message"
        placeholder="Tell us what you'd like to see."
        textarea
        rows={5}
        register={register}
        error={errors.message?.message}
      />

      {/* Hidden mirrors */}
      <input type="hidden" name="from_name"  value={watchName  || ""} readOnly />
      <input type="hidden" name="from_email" value={watchEmail || ""} readOnly />
      <input type="hidden" name="lead_type"  value={type} readOnly />

      {showSubmitButton && (
        <button type="submit" className="hidden" disabled={sending || isSubmitting}>
          {submitLabel}
        </button>
      )}
    </form>
  );
};

export default NavgationForm;
