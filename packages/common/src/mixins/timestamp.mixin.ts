export function addTimestampHooks(repo: any) {
  repo.modelClass.observe('before save', async ctx => {
    const now = new Date().toISOString();

    if (ctx.instance) {
      if (ctx.isNewInstance) {
        ctx.instance.createdOn = now;
      }
      ctx.instance.modifiedOn = now;
    } else if (ctx.data) {
      ctx.data.modifiedOn = now;
    }
  });
}