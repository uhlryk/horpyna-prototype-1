class ParamType{
	public static PARAM_URL: string = "url";//url param czyli /:id
	public static PARAM_QUERY: string = "query"; //string w url czyli ?cos=fo&dd=gf
	public static PARAM_BODY: string = "body"; //z formularzy
	public static PARAM_APP: string = "app"; // parametry nadane w aplikacji, np user_id
}
export = ParamType;