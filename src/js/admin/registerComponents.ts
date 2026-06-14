import Table from '@admin/components/Table';

const petitionerComponents = {
	Table,
}

export type PetitionerComponents = typeof petitionerComponents;

export function registerComponents() {
	window.petitionerComponents = petitionerComponents;
}
