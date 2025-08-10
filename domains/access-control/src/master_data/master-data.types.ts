export type MasterDataType = {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
	resources: {
		[resourceType: string]: {
			attributes: {
				[attribute: string]: 'string' | 'number' | 'boolean' | 'Date';
			};
			permissions: string[];
		};
	};
};
