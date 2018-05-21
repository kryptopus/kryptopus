/* @flow */

export default class Landing
{
    async homepage(context:any)
    {
        await context.render("landing/homepage");
    }
}
