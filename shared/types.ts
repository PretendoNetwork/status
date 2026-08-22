export type StatusService = {
	id: string;
	name: string;
	healthy: boolean;
	lastHealthyAt: string;
};

export type StatusResponse = {
	services: StatusService[];
};

export type IncidentPost = {
	id: string;
	createdAt: string;
	title: string;
	body: string | null;
};

export type Incident = {
	id: string;
	startedAt: string;
	resolvedAt: string | null;
	posts: IncidentPost[];
};

export type IncidentList = {
	data: Incident[];
};
