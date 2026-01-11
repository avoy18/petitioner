import { Dashicon } from '@wordpress/components';
import Submissions from './Submissions';
import FormBuilder from './FormBuilder';
import PetitionDetails from '@admin/sections/EditFields/PetitionDetails';
import BottomCallout from '@admin/sections/EditFields/BottomCallout';
import AdvancedSettings from '@admin/sections/EditFields/AdvancedSettings';
import Tabs from '@admin/components/Tabs';
import OptionList from '@admin/components/OptionList';

import {
	EditFormContextProvider,
	useEditFormContext,
} from '@admin/context/EditFormContext';

export const tabs = [
	{
		name: 'option-list',
		title: (
			<>
				<Dashicon icon="email-alt" /> Option list
			</>
		),
		className: 'petition-tablink',
		renderingEl: (
			<OptionList
				label={'Field options'}
				maxHeight={300}
				options={[
					"Afghanistan",
					"Albania",
					"Algeria",
					"Andorra",
					"Angola",
					"Antigua & Deps",
					"Argentina",
					"Armenia",
					"Australia",
					"Austria",
					"Azerbaijan",
					"Bahamas",
					"Bahrain",
					"Bangladesh",
					"Barbados",
					"Belarus",
					"Belgium",
					"Belize",
					"Benin",
					"Bhutan",
					"Bolivia",
					"Bosnia Herzegovina",
					"Botswana",
					"Brazil",
					"Brunei",
					"Bulgaria",
					"Burkina",
					"Burundi",
					"Cambodia",
					"Cameroon",
					"Canada",
					"Cape Verde",
					"Central African Rep",
					"Chad",
					"Chile",
					"China",
					"Colombia",
					"Comoros",
					"Congo",
					"Congo {Democratic Rep}",
					"Costa Rica",
					"Croatia",
					"Cuba",
					"Cyprus",
					"Czech Republic",
					"Denmark",
					"Djibouti",
					"Dominica",
					"Dominican Republic",
					"East Timor",
					"Ecuador",
					"Egypt",
					"El Salvador",
					"Equatorial Guinea",
					"Eritrea",
					"Estonia",
					"Ethiopia",
					"Fiji",
					"Finland",
					"France",
					"Gabon",
					"Gambia",
					"Georgia",
					"Germany",
					"Ghana",
					"Greece",
					"Grenada",
					"Guatemala",
					"Guinea",
					"Guinea-Bissau",
					"Guyana",
					"Haiti",
					"Honduras",
					"Hungary",
					"Iceland",
					"India",
					"Indonesia",
					"Iran",
					"Iraq",
					"Ireland {Republic}",
					"Israel",
					"Italy",
					"Ivory Coast",
					"Jamaica",
					"Japan",
					"Jordan",
					"Kazakhstan",
					"Kenya",
					"Kiribati",
					"Korea North",
					"Korea South",
					"Kosovo",
					"Kuwait",
					"Kyrgyzstan",
					"Laos",
					"Latvia",
					"Lebanon",
					"Lesotho",
					"Liberia",
					"Libya",
					"Liechtenstein",
					"Lithuania",
					"Luxembourg",
					"Macedonia",
					"Madagascar",
					"Malawi",
					"Malaysia",
					"Maldives",
					"Mali",
					"Malta",
					"Marshall Islands",
					"Mauritania",
					"Mauritius",
					"Mexico",
					"Micronesia",
					"Moldova",
					"Monaco",
					"Mongolia",
					"Montenegro",
					"Morocco",
					"Mozambique",
					"Myanmar, {Burma}",
					"Namibia",
					"Nauru",
					"Nepal",
					"Netherlands",
					"New Zealand",
					"Nicaragua",
					"Niger",
					"Nigeria",
					"Norway",
					"Oman",
					"Pakistan",
					"Palau",
					"Panama",
					"Papua New Guinea",
					"Paraguay",
					"Peru",
					"Philippines",
					"Poland",
					"Portugal",
					"Qatar",
					"Romania",
					"Russian Federation",
					"Rwanda",
					"St Kitts & Nevis",
					"St Lucia",
					"Saint Vincent & the Grenadines",
					"Samoa",
					"San Marino",
					"Sao Tome & Principe",
					"Saudi Arabia",
					"Senegal",
					"Serbia",
					"Seychelles",
					"Sierra Leone",
					"Singapore",
					"Slovakia",
					"Slovenia",
					"Solomon Islands",
					"Somalia",
					"South Africa",
					"South Sudan",
					"Spain",
					"Sri Lanka",
					"Sudan",
					"Suriname",
					"Swaziland",
					"Sweden",
					"Switzerland",
					"Syria",
					"Taiwan",
					"Tajikistan",
					"Tanzania",
					"Thailand",
					"Togo",
					"Tonga",
					"Trinidad & Tobago",
					"Tunisia",
					"Turkey",
					"Turkmenistan",
					"Tuvalu",
					"Uganda",
					"Ukraine",
					"United Arab Emirates",
					"United Kingdom",
					"United States",
					"Uruguay",
					"Uzbekistan",
					"Vanuatu",
					"Vatican City",
					"Venezuela",
					"Vietnam",
					"Yemen",
					"Zambia",
					"Zimbabwe"
				]}
				onOptionsChange={(options) => {
					console.log('options changed', options);
				}}
			/>
		),
	},
	{
		name: 'petition-details',
		title: (
			<>
				<Dashicon icon="email-alt" /> Petition details
			</>
		),
		className: 'petition-tablink',
		renderingEl: <PetitionDetails />,
	},
	{
		name: 'form-builder',
		title: (
			<>
				<Dashicon icon="welcome-widgets-menus" /> Form builder
			</>
		),
		className: 'petition-tablink',
		renderingEl: <FormBuilder />,
	},
	{
		name: 'advanced-settings',
		title: (
			<>
				<Dashicon icon="admin-settings" /> Advanced settings
			</>
		),
		className: 'petition-tablink',
		renderingEl: <AdvancedSettings />,
	},
	{
		name: 'submissions',
		title: (
			<>
				<Dashicon icon="editor-ul" /> Submissions
			</>
		),
		className: 'petition-tablink',
		renderingEl: <Submissions />,
	},
];

function EditFieldsComponent() {
	const { formState } = useEditFormContext();
	const { active_tab } = formState;

	return (
		<>
			<Tabs tabs={tabs} defaultTab={active_tab} updateURL={true} />
			<BottomCallout />
		</>
	);
}

export default function EditFields() {
	return (
		<EditFormContextProvider>
			<EditFieldsComponent />
		</EditFormContextProvider>
	);
}
