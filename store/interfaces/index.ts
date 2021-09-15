export * from './Customer'
export * from './LoginPayload'
export * from './Cart'
export * from './Address'
export * from './Recipe'

export * from './Product'
export * from './SignUpPayload'

export interface Saga{
    on:any;
    worker:any
}

export interface Payload {
	ID?: string;
	req?: any;
	cb?: any;
	other?: any;
}

export interface Action {
	payload: Payload;
}

export interface TokenDecode {
	user_role: string;
	customer?: {
		first_name: string;
		last_name: string;
		email: string;
		_id: string;
	};
	iat: number;
	exp: number;
}