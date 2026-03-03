export const PrettyJSON = ({json}: { json: any }) => {
  return <pre
    className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">{JSON.stringify(json ?? {}, null, 2)}</pre>;
}
