class FieldType{
	public static PARAM_FIELD: string = "param";//url param czyli /:id
	public static QUERY_FIELD: string = "query"; //string w url czyli ?cos=fo&dd=gf
	public static BODY_FIELD: string = "body"; //z formularzy
	public static APP_FIELD: string = "app"; // parametry nadane w aplikacji, np user_id
}
export = FieldType;