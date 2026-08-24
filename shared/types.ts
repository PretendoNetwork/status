export type StatusServiceTimeline = Record<string, [total: number, success: number]>;

export type StatusService = {
	id: string;
	name: string;
	healthy: boolean;
	lastHealthyAt: string | null;
	timeline: StatusServiceTimeline;
};

export type StatusResponse = {
	services: StatusService[];
	incidents: Incident[];
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

export type DeleteResult = {
	id: string;
};
