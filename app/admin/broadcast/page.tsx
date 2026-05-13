import { publishAdminAnnouncement } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Panel } from "@/components/admin/admin-ui";

export default async function AdminBroadcastPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--acid)]">{"//"} broadcast</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">Announcements</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">Publish to the TV rail and participant surfaces.</p>
      </header>

      <Panel title={"// new announcement"} right="live">
        <form action={publishAdminAnnouncement} className="grid max-w-2xl gap-3 p-5">
          <Field label="title" name="title" placeholder="Snack run at 16:00" />
          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--text-mute)]">message</span>
            <textarea
              name="message"
              required
              rows={6}
              placeholder="Submit early before 17:00 for bonus points."
              className="w-full rounded-none border border-[var(--line)] bg-black px-3 py-2 font-mono text-sm text-white outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--acid)]"
            />
          </label>
          <Button className="w-fit rounded-none font-mono text-[10px] uppercase">send to TV rail</Button>
        </form>
      </Panel>
    </div>
  );
}
