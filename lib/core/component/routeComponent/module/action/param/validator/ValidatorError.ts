interface ValidatorError {
	formatter: any; //wiadomość zawierając %s %d itp
	args?: any[];
}
export = ValidatorError;