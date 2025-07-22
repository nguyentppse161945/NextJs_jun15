"use server";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

//create invoice here
export async function createInvoices(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    // insert data into db
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    console.error(error);
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

//update invoice here
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id=${customerId}, amount=${amountInCents}, status=${status}
    WHERE id=${id}
    `;
    //as bussiness logic, we don't updat the status of the invoice as paid
  } catch (error) {
    console.error(error);
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

//delete invoice here
export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice'); // test error.tsx page

  try {
    await sql`DELETE FROM invoices WHERE id=${id}`;
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/dashboard/invoices");
}
