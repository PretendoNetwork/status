export type StatusService = {
	id: string;
	name: string;
	healthy: boolean;
};

export type StatusResponse = {
	services: StatusService[];
};

export type IncidentContent = {
	id: string;
	createdAt: string;
	title: string;
	body: string;
};

export type IncidentStatus = 'ongoing' | 'resolved';

export type Incident = {
	id: string;
	startedAt: string;
	resolvedAt: string | null;
	content: IncidentContent;
};

export type IncidentList = {
	data: Incident[];
};
