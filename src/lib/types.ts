





export type BillingInformation = 'personal' | 'user' | 'owner' | 'landlord' | 'company' | string | null;

export const repairItems = [
    { id: 'DISHWASHER', label: 'DISHWASHER', note: undefined },
    { id: 'MICROWAVE', label: 'MICROWAVE', note: undefined },
    { id: 'OVEN', label: 'OVEN', note: undefined },
    { id: 'TUMBLE DRYER', label: 'TUMBLE DRYER', note: undefined },
    { id: 'WASHING MACHINE', label: 'WASHING MACHINE', note: undefined },
    { id: 'CHEST FREEZER', label: 'CHEST FREEZER', note: "We don't do Regas or Compressor Exchange" },
    { id: 'FRIDGE', label: 'FRIDGE', note: "We don't do Regas or Compressor Exchange" },
    { id: 'CAMPING FRIDGE', label: 'CAMPING FRIDGE', note: "We repair this item at our workshop only - We don't do Regas or Compressor Exchange" },
    { id: 'AIR FRYER', label: 'AIR FRYER', note: 'We repair this item at our workshop only' },
    { id: 'COFFEE MACHINE', label: 'COFFEE MACHINE', note: 'We repair this item at our workshop only' },
    { id: 'ICE MACHINE', label: 'ICE MACHINE', note: 'We repair this item at our workshop only' },
    { id: 'SNAPPY CHEF', label: 'SNAPPY CHEF', note: 'We repair this item at our workshop only' },
    { id: 'SMEG KETTLE', label: 'SMEG KETTLE', note: 'We repair this item at our workshop only' },
    { id: 'SMEG TOASTER', label: 'SMEG TOASTER', note: 'We repair this item at our workshop only' },
    { id: 'VACUUM CLEANER', label: 'VACUUM CLEANER', note: 'We repair this item at our workshop only' },
    { id: 'OTHER', label: 'Other', note: undefined },
] as const;
export type RepairItem = (typeof repairItems)[number]['id'];
export type RepairItemObject = (typeof repairItems)[number];


export const paymentMethods = [
  { id: "Card", label: "Card (Card Machine)" },
  { id: "EFT", label: "EFT" },
  { id: "PayShap", label: "PayShap" },
] as const;
export type PaymentMethod = (typeof paymentMethods)[number]['id'];

export const propertyTypes = ['Home', 'Complex', 'House in an Estate', 'Complex in an Estate', 'Office', 'Small Holding', 'Farm', 'OTHER'] as const;
export type PropertyType = (typeof propertyTypes)[number];

export const propertyFunctions = ['Private', 'Business'] as const;
export type PropertyFunction = (typeof propertyFunctions)[number];

export const cities = ['Centurion', 'Midrand', 'Pretoria', 'Other'] as const;
export type City = (typeof cities)[number];

export const centurionSuburbs = [
    'Amberfield', 'Arandia', 'Bronberrick', 'Celtisdal', 'Centurion Central', 'Claudius', 
    'Clubview', 'Die Hoewes', 'Doringkloof', 'Eco-Park Estate', 'Eldoraigne', 'Erasmia', 'Hennopspark', 
    'Heuweloord', 'Highveld', 'Irene', 'Kloofsig', 'Kosmosdal', 'Laudium', 'Louwlardia', 
    'Lyttelton', 'Lyttelton A.H.', 'Lyttelton Manor', 'Midstream', 'Monavoni', 'Olievenhoutbosch', 
    'Pierre van Ryneveld Park', 'Raslouw', 'Rooihuiskraal', 'Rooihuiskraal Noord', 
    'Sunderland Ridge', 'Thatchfield', 'The Reeds', 'Valhalla', 'Wierda Park', 'Zwartkop'
];
export type CenturionSuburb = (typeof centurionSuburbs)[number];

export const pretoriaSuburbs = [
    'Akasia', 'Amandasig', 'Annlin', 'Arcadia', 'Boardwalk', 'Brooklyn', 'Chantelle', 'Claremont', 'Clydesdale', 'Constantia Park', 'Danville', 'Daspoort', 'Doornpoort', 'Dorandia', 'Elarduspark', 'Equestria', 'Erasmuskloof', 'Erasmusrand', 'Faerie Glen', 'Garsfontein', 'Gezina', 'Groenkloof', 'Hatfield', 'Hazelwood', 'Hermanstad', 'Karenpark', 'Kirkney', 'Lady Selborne', 'Lukasrand', 'Lynnwood', 'Magalieskruin', 'Menlo Park', 'Montana', 'Monument Park', 'Moreleta Park', 'Mountain View', 'Muckleneuk', 'Newlands', 'Pretoria Central', 'Pretoria North', 'Pretoria West', 'Proclamation Hill', 'Rietvalleirand', 'Riviera', 'Salvokop', 'Silver Lakes', 'Sinoville', 'Suiderberg', 'Sunnyside', 'Theresapark', 'Wapadrand', 'Waterkloof', 'Waterkloof Ridge', 'Wingate Park', 'Wonderboom'
];
export type PretoriaSuburb = (typeof pretoriaSuburbs)[number];

export const midrandSuburbs = [
    'Allandale', 'Barbeque Downs', 'Beaulieu', 'Blue Hills', 'Carlswald', 'Clayville', 'Country View', 'Crowthorne', 'Ebony Park', 'Erand', 'Glen Austin', 'Glenferness', 'Halfway Gardens', 'Halfway House', 'Ivory Park', 'Kaalfontein', 'Kyalami', 'Noordwyk', 'President Park', 'Rabie Ridge', 'Sagewood', 'Summerset', 'Vorna Valley', 'Willaway', 'Waterfall'
];
export type MidrandSuburb = (typeof midrandSuburbs)[number];

export const centurionComplexes: Record<string, string[]> = {
    'Amberfield': ['Albuquerque', 'Amberfield Crest Estate', 'Amberfield Glen Estate', 'Amberfield Heights Estate', 'Amberfield Manor Estate', 'Amberfield Ridge Estate', 'Amberfield Valley Estate', 'Colorado @ Amberfield City', 'The Atlanta @ Amberfield City', 'The Manhattan Lifestyle Estate'],
    'Bronberrick': ['Aleppo Place', 'Bentley Park', 'Bergen', 'Blarney', 'Casa Bella', 'Jasmyn', 'La Paloma', 'Lombardy', 'Villa Neser', 'Willem\'s Hof'],
    'Clubview': ['Janel\'s Place', 'St. George'],
    'Die Hoewes': ['Aragon', 'Atlantis', 'Bayswater', 'Bourbon Street', 'Centurion Golf Estate', 'Crystal Gardens', 'Fountain Villages', 'Golden Fields Estate', 'Hampshire', 'Hennopsview', 'La Comores', 'Le Jardin', 'Lexton', 'Meldt', 'Montserrat', 'Notting Hill', 'Old Trafford', 'Panorama Park', 'Pasadena', 'Regents Park', 'San Marino', 'Sheffield', 'Somerset', 'The Mews', 'The Oval', 'Three Fountains', 'Uitsig', 'Villa Bianco', 'Villa Mia', 'Visagie'],
    'Doringkloof': ['Doringkloof Village'],
    'Eco-Park Estate': ['Eco Park Estate', 'Emerald Gardens', 'Onyx Park'],
    'Eldoraigne': ['Bordeaux', 'Chateaux de Grace', 'Eldo Glen', 'Eldo Park', 'Eldo View', 'Eldo Ridge Estate', 'Eldoraigne Aftreelandgoed', 'Kama Creek', 'La Borie', 'La Motte', 'Morningside', 'The Pines', 'Villa Reinette', 'Villa Shiane'],
    'Hennopspark': ['Basoon Park', 'Bon Courage', 'Carmen', 'Ilanga', 'Jean Park', 'Karana', 'Katarina', 'Roosmaryn', 'Via Bianca'],
    'Heuweloord': ['Arundo Estate', 'Heuwelsig Estate', 'Stone Gate', 'Thornfields'],
    'Highveld': ['Corfu', 'Highveld Estate', 'Irene View Estate', 'Kariba', 'Porto Bella', 'Santorini', 'Sparrow Circle Estate', 'The Columns'],
    'Irene': ['Cornwall Hill Estate', 'Irene Farm Villages', 'Irene Woods Estate', 'Southdowns Estate'],
    'Kosmosdal': ['Blue Valley Golf Estate', 'Candlewoods Country Estate', 'Country View Estate', 'Summerfields'],
    'Lyttelton': ['Baldersbronn', 'Brandwag', 'Clifton Hill', 'Fijnbos', 'Goedehoop', 'Kasteel', 'La-Vue', 'Laborie', 'Loucharl', 'Villa Martine'],
    'Lyttelton Manor': ['Baldersbronn', 'Brandwag', 'Clifton Hill', 'Fijnbos', 'Goedehoop', 'Kasteel', 'La-Vue', 'Laborie', 'Loucharl', 'Villa Martine'],
    'Midstream': ['Ascend to Midstream', 'Midfield Estate', 'Midlands Estate', 'Midstream Estate', 'Midstream Heights', 'Midstream Hill Estate', 'Midstream Meadows', 'Midstream Ridge Estate', 'Retire at Midstream'],
    'Monavoni': ['Silverstone Estate', 'Stone Ridge Country Estate', 'Thatch Hill Estate', 'The Hudson Estate', 'Valley View Estate', 'Westwood'],
    'Pierre van Ryneveld Park': ['De prestige', 'Rietvlei Heights Country Estate', 'Rietvlei Ridge Country Estate'],
    'Rooihuiskraal': ['Amber Ridge', 'Anabranch', 'Avignon', 'Bavaria', 'Belgaum', 'Bianca Villas', 'Cabernet', 'Canterbury', 'Chablis', 'Chardonnay', 'Crafford Park', 'Crecy', 'Dulcian Manor', 'Eden Garden', 'Elkana', 'Fleur de Lis', 'Galloway', 'Jatoba', 'Kildare', 'Knoppiesdoring', 'Kubu', 'La Maison', 'La Terra de Luc', 'Lalaphanzi', 'Langebrigg', 'Lemonwood', 'Magaliesig', 'Marabu', 'Marantan', 'Mauritius', 'Montagu', 'Monte Villas', 'Mopanie', 'Oakhurst', 'Portugal', 'Provence', 'Raspberry', 'Robinhill', 'Rooihuiskraal-Noord (complex)', 'Rua Vista', 'Sahara Glen', 'Santelmo', 'Savannah', 'Serene', 'Serengeti', 'Shamrock', 'Silver Oaks', 'Stockholm Complex', 'Tehilla', 'Tugela', 'Umgeni', 'Verona', 'Villa Chemika', 'Villa d\'Alegria', 'Villa Serine', 'Villieria', 'Waterberg Fields', 'Willow Creek', 'Willow Haven', 'Willow Park', 'Willowdene', 'Willowvale', 'Zambezi'],
    'Rooihuiskraal Noord': ['Amber Ridge', 'Anabranch', 'Avignon', 'Bavaria', 'Belgaum', 'Bianca Villas', 'Cabernet', 'Canterbury', 'Chablis', 'Chardonnay', 'Crafford Park', 'Crecy', 'Dulcian Manor', 'Eden Garden', 'Elkana', 'Fleur de Lis', 'Galloway', 'Jatoba', 'Kildare', 'Knoppiesdoring', 'Kubu', 'La Maison', 'La Terra de Luc', 'Lalaphanzi', 'Langebrigg', 'Lemonwood', 'Magaliesig', 'Marabu', 'Marantan', 'Mauritius', 'Montagu', 'Monte Villas', 'Mopanie', 'Oakhurst', 'Portugal', 'Provence', 'Raspberry', 'Robinhill', 'Rooihuiskraal-Noord (complex)', 'Rua Vista', 'Sahara Glen', 'Santelmo', 'Savannah', 'Serene', 'Serengeti', 'Shamrock', 'Silver Oaks', 'Stockholm Complex', 'Tehilla', 'Tugela', 'Umgeni', 'Verona', 'Villa Chemika', 'Villa d\'Alegria', 'Villa Serine', 'Villieria', 'Waterberg Fields', 'Willow Creek', 'Willow Haven', 'Willow Park', 'Willowdene', 'Willowvale', 'Zambezi'],
    'Thatchfield': ['Thatchfield Estate', 'Thatchfield Ridge'],
    'The Reeds': ['Alcade', 'Barrique', 'Brooklands Lifestyle Estate', 'Casa Grande', 'Casa Mia', 'Clarinet Ridge', 'Estann', 'Glenfields', 'Hereford Estate', 'Hill View', 'Hillstead', 'Hurlingham', 'Jade Park', 'Karmel', 'Morton Manor', 'Parksig', 'Presidentia', 'Riverside Estate', 'Saxby', 'Strelitzia', 'The Thornlands', 'Villa Corfu'],
    'Wierda Park': ['Arnolds Creek', 'Battlefields', 'Bondev Park', 'Bronberg', 'Century Manor Estate', 'Wierda Glen Estate', 'Wierdaveld'],
    'Zwartkop': ['Zwartkop Golf Estate'],
};

export const midrandComplexes: Record<string, string[]> = {
    'Barbeque Downs': ['Cheshni', 'Jacana', 'Kyalami Hills', 'Millbrook', 'The Boulevard', 'The Edge', 'The Kyalami', 'The Poplar', 'The Racecourse', 'The Willows', 'Tinza'],
    'Blue Hills': ['Afrivillage', 'Blue Hills Equestrian Estate', 'Blue Hills Ext', 'The Sheds @ Waterfall'],
    'Carlswald': ['Carlswald Creek', 'Carlswald North Estate', 'Carlswald View', 'Cedar Roc', 'Crescentwood Estate', 'Crowthorne Estate', 'Hill of Good Hope', 'Le Mistral', 'Villa Toscana', 'Village-in-Carlswald', 'West End'],
    'Country View': ['Cara Bianca', 'Country View Estate', 'Phoenix Regent Estate', 'The Heights Estate', 'Villa d\'Arc', 'Waterberg'],
    'Crowthorne': ['The Paddocks', 'The Firs', 'The Willows'],
    'Erand': ['Erand Court', 'Erand Mews', 'Phoenix View Estate', 'The Heights', 'Vodaworld Estate'],
    'Glen Austin': ['Austin View', 'Glen Austin Estate', 'The Willows'],
    'Halfway Gardens': ['Halfway Gardens Mews', 'Acacia', 'Broadwalk Crescent', 'Carlswald Meadows', 'Cascade', 'Hillstead', 'Lever Road', 'Matika', 'Midrand Village', 'The West End', 'Waterford complex'],
    'Halfway House': ['Grand Apartments', 'Midrand Square', 'Parkview', 'The Grand'],
    'Kyalami': ['Helderfontein Estate', 'Kyalami Estates', 'Kyalami Glen Estate', 'Kyalami Terrace', 'Saddlebrook Estate', 'The Whisken'],
    'Noordwyk': ['Cottonwood', 'Decimus', 'Lake Xanadu', 'Noordwyk Manor', 'Sanridge', 'Silver Stream Estate', 'Summerset Hill', 'The Crescent'],
    'President Park': ['Glen Acres Park Estate'],
    'Summerset': ['Summerset Place', 'The Grace'],
    'Vorna Valley': ['Le Roux', 'Silverwood', 'The Link', 'Villa Rondè', 'Waterfall Ridge'],
    'Waterfall': ['Ellipse Waterfall', 'Kikuyu', 'The Munyaka', 'The Polofields', 'Waterfall Country Estate', 'Waterfall Country Village'],
};

export const pretoriaComplexes: Record<string, string[]> = {
    'Boardwalk': ['Boardwalk Meander', 'Boardwalk Manor Estate', 'Boardwalk Villas'],
    'Brooklyn': ['Brooklyn Stone', 'IQ Brooklyn', 'The Urban', 'The Village'],
    'Constantia Park': ['Constantia Gardens', 'Constantia Mews', 'Constantia Place'],
    'Equestria': ['Boulders', 'Equestria Estate', 'Paramount Estate', 'The Grove', 'Tygervalley', 'Willow Acres Estate'],
    'Erasmuskloof': ['Castle Gate', 'Erasmus Park', 'Kloofsig'],
    'Faerie Glen': ['The Paramount', 'Faerie Glen Village', 'Glenwood', 'The Glen', 'Valley Farm'],
    'Garsfontein': ['Bella Vista', 'El Dòr', 'Garsfontein Park', 'The Glades', 'Woodlands Grove'],
    'Hazelwood': ['The Club', 'The Village', 'Trilogy Collection'],
    'Lynnwood': ['Lynnwood Manor Estate', 'Lynnwood Place', 'The Pad', 'Stratus'],
    'Menlo Park': ['The Capital', 'The Hub', 'The Trilogy', 'Menlyn Maine Residences'],
    'Moreleta Park': ['The Wilds', 'Moreleta Park Village', 'The Meadows', 'Olivewood', 'Hillside', 'Waterkloof View', 'Country Walk'],
    'Newlands': ['Newlands Terrace', 'The Gables', 'Village on Charles'],
    'Rietvalleirand': ['Rietvlei Heights Country Estate', 'Waterkloof Heights'],
    'Silver Lakes': ['Silver Lakes Golf Estate', 'Lombardy Estate', 'Six Fountains Estate'],
    'Wapadrand': ['Wapadrand Security Village', 'The Bataleur'],
    'Waterkloof': ['Waterkloof Palms', 'The Ridge Estate', 'Waterkloof on Main', 'Waterkloof Marina'],
    'Waterkloof Ridge': ['Waterkloof Palms', 'The Ridge Estate', 'Waterkloof on Main', 'Waterkloof Marina'],
    'Amandasig': ['Amandasig Aftree Oord', 'Heatherdale'],
    'Annlin': ['Annlin Place', 'Annlin Gardens', 'Crimson Cherry', 'Zambezi Manor'],
    'Chantelle': ['Chantelle Park', 'Chantelle Mews', 'The Orchards'],
    'Doornpoort': ['Doornpoort complex', 'Deo Gloria'],
    'Karenpark': ['Akasia', 'Karenpark Crossing', 'The Orchards'],
    'Montana': ['Zambezi Estate', 'Bougainvillea Estate', 'Montana Gardens', 'Sable Hills Waterfront Estate', 'Green Acres Estate', 'Monatana Tuine'],
    'Sinoville': ['Sinoville Villas', 'Magaliesberg Country Estate', 'Stephanus'],
    'Theresapark': ['Terra Gardens', 'Theresapark Estate', 'Valencia'],
    'Arcadia': ['Union Buildings View', 'Hamilton Court', 'Arcadia Place', 'Loftus Versfeld'],
    'Gezina': ['Roseville', 'Villeria'],
    'Hatfield': ['Duncan Court', 'Festival\'s Edge', 'Hatfield Square', 'The Edge'],
    'Muckleneuk': ['Groenkloof Estates', 'Muckleneuk Manor', 'The Diplomat', 'Fehrsen'],
    'Groenkloof': ['Groenkloof Estates', 'Muckleneuk Manor', 'The Diplomat', 'Fehrsen'],
    'Riviera': ['Riviera Mews', 'The Riviera'],
    'Sunnyside': ['Sunny Court', 'Bultman', 'Jacaranda Park', 'Walker Street'],
    'Danville': ['Danville Hof', 'Daspoort Villas', 'Elandspoort'],
    'Daspoort': ['Danville Hof', 'Daspoort Villas', 'Elandspoort'],
    'Kirkney': ['Kirkney Village', 'The Westview'],
    'Pretoria West': ['West Park', 'WF Nkomo Village', 'Proclamation Hill'],
    'Suiderberg': ['Suiderberg Mews', 'Suiderberg Villas']
};

export interface TermsAgreement {
    paymentOnPremises: boolean;
    emailConsent: boolean;
}

export interface BookingSlot {
  date: string;
  time: string;
}

export interface WebhookConfirmation {
  status: 'Confirmed' | 'Booked' | 'Failed' | string;
  message?: string;
  dateTime?: string; // The original ISO string from the booking system
  Date?: string;     // e.g., "2024-07-20"
  Time?: string;     // e.g., "14:00"
  error?: string;
  [key: string]: any; // Allow other properties
}


export interface AvailabilitySlot {
  slotStart: string;
}

export type BookingFor = 'personal' | 'landlord' | 'company' | 'friend';

// Represents the structured address data
export type AddressDetails = {
    propertyType?: PropertyType;
    propertyFunction?: 'Private' | 'Business';
    accessCodeRequired?: 'yes' | 'no';
    // Home
    houseNumber?: string;
    streetName?: string;
    // Complex
    unitNumber?: string;
    complexName?: string;
    otherComplexName?: string;
    streetNumber?: string;
    // Estate
    standNumber?: string;
    streetNameInEstate?: string;
    estateName?: string;
    // Office
    officeName?: string;
    officeParkName?: string;
    // Small Holding
    holdingName?: string;
    // Farm
    farmName?: string;
    // Other
    otherPropertyType?: string;
    // Shared
    suburb?: string;
    city?: City;
    otherCityDescription?: string;
otherSuburb?: string;
};


// This is the complete data structure for the entire booking flow
export interface BookingData {
  // Personal details (can be the user, or the contact person for company/friend)
  name: string;
  surname: string;
  cellNumber: string;
  email: string;
  
  // Service address details
  addressDetails: AddressDetails;
  formattedAddress: string;

  // Type of booking
  bookingFor: BookingFor;

  // Landlord details
  landlordName: string;
  landlordSurname: string;
  landlordCellNumber: string;
  landlordEmail: string;
  
  // Owner details (for friend/family)
  ownerName: string;
  ownerSurname: string;
  ownerCellNumber: string;
  ownerEmail: string;

  // Company details
  companyName: string;
  companyPhone: string;
  companyEmail: string;

  // Repair details
  itemsToRepair: RepairItem[];
  problemDescriptions: Record<string, string>;
  
  // Payment and confirmation
  paymentMethods: PaymentMethod[];
  billingInformation: BillingInformation | null;
  termsAgreement: TermsAgreement | null;
  selectedDateTime: BookingSlot | null;
  webhookConfirmation: WebhookConfirmation | null;
  
  // Internal tracking
  servicePath: string[];
}

export interface BookingState extends BookingData {
  availability: AvailabilitySlot[];
  setBookingFor: (bookingFor: BookingFor) => void;
  setPersonalDetails: (details: { name: string; surname: string; cellNumber: string; email: string }) => void;
  setAddressDetails: (details: AddressDetails) => void;
  setLandlordDetails: (details: { landlordName: string; landlordSurname: string; landlordCellNumber: string; landlordEmail: string; }) => void;
  setOwnerDetails: (details: { ownerName: string; ownerSurname: string; ownerCellNumber: string; ownerEmail: string; }) => void;
  setCompanyDetails: (details: { companyName: string; companyPhone: string; companyEmail: string; }) => void;
  setItemsToRepair: (items: RepairItem[]) => void;
  setProblemDescriptions: (descriptions: Record<string, string>) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setBillingInformation: (billingInformation: BillingInformation) => void;
  setTermsAgreement: (agreement: TermsAgreement | null) => void;
  setSelectedDateTime: (dateTime: BookingSlot | null) => void;
  setAvailability: (availability: AvailabilitySlot[]) => void;
  setWebhookConfirmation: (data: WebhookConfirmation | null) => void;
  setServicePath: (path: string[]) => void;
  resetBooking: () => void;
}
