import FieldType = require("./../routeComponent/module/action/field/FieldType");
class SourceType {
	public static RESPONSE_NODE: string = "node_response_stream";
	public static RESPONSE_NODE_1: string = "node_response_stream_1";
	public static RESPONSE_NODE_2: string = "node_response_stream_2";
	public static RESPONSE_NODE_3: string = "node_response_stream_3";
	public static RESPONSE_NODE_4: string = "node_response_stream_4";
	public static RESPONSE_NODE_5: string = "node_response_stream_5";
	public static PARAM_FIELD: string = FieldType.PARAM_FIELD;//url param czyli /:id
	public static QUERY_FIELD: string = FieldType.QUERY_FIELD; //string w url czyli ?cos=fo&dd=gf
	public static BODY_FIELD: string = FieldType.BODY_FIELD; //z formularzy
	public static APP_FIELD: string = FieldType.APP_FIELD; // parametry nadane w aplikacji, np user_id
	public static HEADER_FIELD: string = FieldType.HEADER_FIELD; // parametry nadane w aplikacji, np user_id
	public static FILE_FIELD: string = FieldType.FILE_FIELD; // oczekiwane pliki
}
export = SourceType;