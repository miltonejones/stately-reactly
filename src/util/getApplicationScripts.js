export const getApplicationScripts = (context) => {
  const { application } = context;
  const pageCode = application?.pages?.reduce((out, page) => {
    const scripts = page.scripts?.filter(f => !!f.code)
    return !scripts ? out : out.concat(scripts?.map(f => ({...f, PageName: page.PageName})))
  }, []);
  const appCode = application?.scripts?.filter(f => !!f.code);
  if (!pageCode) return []
  return  [...pageCode, ...appCode]
}