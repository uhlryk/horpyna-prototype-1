interface ValidatorResponse {
	valid: boolean;//brak błędu to true
	value: any; //wartość jaka była walidowana
	validator: string;//nazwa walidatora
	field: string;//pole podlegające walidacji
	errorList?: string[];//jeśli błędy to tu lista
}
export = ValidatorResponse;