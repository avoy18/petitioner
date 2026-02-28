import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { isNonEmptyObject } from '@admin/utilities';
import { __ } from '@wordpress/i18n';

import type {
	BuilderFieldMap,
	BuilderField,
	FormBuilderContextValue,
	FormBuilderContextProviderProps,
	FieldOrderItems,
} from '@admin/sections/EditFields/FormBuilder/consts';

export const FormBuilderContext = createContext<FormBuilderContextValue | null>(
	null
);

const normalizeBuilderConfig = () => {
	const rawData = window.petitionerData?.builder_config || {};
	const defaultData = {
		draggable: [],
		defaults: {},
	};
	return { ...defaultData, ...rawData };
};

export function getDraggableFields(): BuilderField[] {
	const cleanBuilderConfig = normalizeBuilderConfig();
	const draggableFieldTypes: BuilderField[] =
		(cleanBuilderConfig.draggable) || [];

	const finalDraggableFields = applyFilters(
		'petitioner.formBuilder.draggableFields',
		draggableFieldTypes
	) as BuilderField[];

	return Array.isArray(finalDraggableFields)
		? finalDraggableFields
		: draggableFieldTypes;
}

export function getDefaultBuilderFields(): BuilderFieldMap {
	const cleanBuilderConfig = normalizeBuilderConfig();
	const defaultBuilderFields: BuilderFieldMap =
		(cleanBuilderConfig.defaults) || {};

	const finalDefaultBuilderFields = applyFilters(
		'petitioner.formBuilder.defaultFields',
		defaultBuilderFields
	) as BuilderFieldMap;

	return finalDefaultBuilderFields || defaultBuilderFields;
}

export function getAllPossibleFields(): BuilderField[] {
	const draggableFields = getDraggableFields();
	const defaultFields = getDefaultBuilderFields();

	return [...draggableFields, ...Object.values(defaultFields)];
}

export function FormBuilderContextProvider({
	children,
}: FormBuilderContextProviderProps) {
	const { form_fields = {}, field_order = [] } = window.petitionerData;
	const filteredDefaultFields = getDefaultBuilderFields();

	const startingFormFields = isNonEmptyObject(form_fields)
		? (form_fields as BuilderFieldMap)
		: filteredDefaultFields;

	const [formBuilderFields, setFormBuilderFields] =
		useState(startingFormFields);

	const [builderEditScreen, setBuilderEditScreen] = useState('default');

	const updateFormBuilderFields = useCallback(
		<K extends keyof BuilderFieldMap>(
			key: K,
			value: BuilderFieldMap[K]
		) => {
			setFormBuilderFields((prevState) => ({
				...prevState,
				[key]: value,
			}));
		},
		[]
	);

	const removeFormBuilderField = <K extends keyof BuilderFieldMap>(
		key: K
	) => {
		// remove from the order array
		setFieldOrder((prevOrder) => prevOrder.filter((item) => item !== key));

		// remove from the fields map
		setFormBuilderFields((prevState) => {
			const newState = { ...prevState };
			delete newState[key];
			return newState;
		});
	};

	const addFormBuilderField = useCallback(
		(id: string, field: BuilderField) => {
			setFormBuilderFields((prevState) => {
				const newField = { ...field };
				delete newField['fieldKey'];
				return { ...prevState, [id]: newField };
			});
		},
		[]
	);

	const defaultFieldOrder =
		Array.isArray(field_order) && field_order.length
			? field_order
			: Object.keys(formBuilderFields);

	const [fieldOrder, setFieldOrder] =
		useState<FieldOrderItems>(defaultFieldOrder);

	return (
		<FormBuilderContext.Provider
			value={{
				formBuilderFields,
				updateFormBuilderFields,
				builderEditScreen,
				setBuilderEditScreen,
				removeFormBuilderField,
				fieldOrder,
				setFieldOrder,
				addFormBuilderField,
			}}
		>
			{children}
		</FormBuilderContext.Provider>
	);
}

export function useFormBuilderContext() {
	const context = useContext(FormBuilderContext);
	if (!context) {
		throw new Error(
			'useFormBuilderContext must be used within an FormBuilderContextProvider'
		);
	}
	return context;
}
