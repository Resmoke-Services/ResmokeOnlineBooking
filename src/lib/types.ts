
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isGuest: boolean;
}

export type BillingInformation = 'personal' | 'user' | 'owner' | 'landlord' | 'company' | string | null;

export const repairItems = [
    { id: 'DISHWASHER', label: 'DISHWASHER', note: undefined },
    { id: 'MICROWAVE', label: 'MICROWAVE', note: undefined },
    { id: 'OVEN', label: 'OVEN', note: undefined },
    { id: 'TUMBLE_DRYER', label: 'TUMBLE DRYER', note: undefined },
    { id: 'WASHING_MACHINE', label: 'WASHING MACHINE', note: undefined },
    { id: 'FRIDGE', label: 'FRIDGE', note: "We don't do Regas or Compressor Exchange" },
    { id: 'ICE_MACHINE', label: 'ICE MACHINE', note: 'We repair this item at our workshop only' },
    { id: 'TV', label: 'TV', note: 'We repair this item at our workshop only' },
    { id: 'GHD', label: 'GHD', note: 'We repair this item at our workshop only' },
    { id: 'CAR', label: 'CAR', note: 'Diagnostic Scan Onsite - Repairs at Workshop Only' },
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

export const propertyTypes = ['Home', 'Complex', 'Estate', 'Complex in an Estate', 'Office', 'Small Holding', 'Farm', 'Other'] as const;
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
    'Sunderland Ridge', 'Thatchfield', 'The Reeds', 'Valhalla', 'Wierda Park', 'Zwartkop', 'Other'
] as const;
export type CenturionSuburb = (typeof centurionSuburbs)[number];

export const pretoriaSuburbs = [
    'Akasia', 'Amandasig', 'Annlin', 'Arcadia', 'Boardwalk', 'Brooklyn', 'Chantelle', 'Claremont', 'Clydesdale', 'Constantia Park', 'Danville', 'Daspoort', 'Doornpoort', 'Dorandia', 'Elarduspark', 'Equestria', 'Erasmuskloof', 'Erasmusrand', 'Faerie Glen', 'Garsfontein', 'Gezina', 'Groenkloof', 'Hatfield', 'Hazelwood', 'Hermanstad', 'Karenpark', 'Kirkney', 'Lady Selborne', 'Lukasrand', 'Lynnwood', 'Magalieskruin', 'Menlo Park', 'Montana', 'Monument Park', 'Moreleta Park', 'Mountain View', 'Muckleneuk', 'Newlands', 'Pretoria Central', 'Pretoria North', 'Pretoria West', 'Proclamation Hill', 'Rietvalleirand', 'Riviera', 'Salvokop', 'Silver Lakes', 'Sinoville', 'Suiderberg', 'Sunnyside', 'Theresapark', 'Wapadrand', 'Waterkloof', 'Waterkloof Ridge', 'Wingate Park', 'Wonderboom', 'Other'
] as const;
export type PretoriaSuburb = (typeof pretoriaSuburbs)[number];

export const midrandSuburbs = [
    'Allandale', 'Barbeque Downs', 'Beaulieu', 'Blue Hills', 'Carlswald', 'Clayville', 'Country View', 'Crowthorne', 'Ebony Park', 'Erand', 'Glen Austin', 'Glenferness', 'Halfway Gardens', 'Halfway House', 'Ivory Park', 'Kaalfontein', 'Kyalami', 'Noordwyk', 'President Park', 'Rabie Ridge', 'Sagewood', 'Summerset', 'Vorna Valley', 'Willaway', 'Waterfall', 'Other'
] as const;
export type MidrandSuburb = (typeof midrandSuburbs)[number];

export const centurionComplexes: Record<string, string[]> = {
    'Amberfield': ['Albuquerque', 'Amberfield Crest Estate', 'Amberfield Glen Estate', 'Amberfield Heights Estate', 'Amberfield Manor Estate', 'Amberfield Ridge Estate', 'Amberfield Valley Estate', 'Colorado @ Amberfield City', 'The Atlanta @ Amberfield City', 'The Manhattan Lifestyle Estate', 'Other'],
    'Bronberrick': ['Aleppo Place', 'Bentley Park', 'Bergen', 'Blarney', 'Casa Bella', 'Jasmyn', 'La Paloma', 'Lombardy', 'Villa Neser', 'Willem\'s Hof', 'Other'],
    'Clubview': ['Janel\'s Place', 'St. George', 'Other'],
    'Die Hoewes': ['Aragon', 'Atlantis', 'Bayswater', 'Bourbon Street', 'Centurion Golf Estate', 'Crystal Gardens', 'Fountain Villages', 'Golden Fields Estate', 'Hampshire', 'Hennopsview', 'La Comores', 'Le Jardin', 'Lexton', 'Meldt', 'Montserrat', 'Notting Hill', 'Old Trafford', 'Panorama Park', 'Pasadena', 'Regents Park', 'San Marino', 'Sheffield', 'Somerset', 'The Mews', 'The Oval', 'Three Fountains', 'Uitsig', 'Villa Bianco', 'Villa Mia', 'Visagie', 'Other'],
    'Doringkloof': ['Doringkloof Village', 'Other'],
    'Eco-Park Estate': ['Eco Park Estate', 'Emerald Gardens', 'Onyx Park', 'Other'],
    'Eldoraigne': ['Bordeaux', 'Chateaux de Grace', 'Eldo Glen', 'Eldo Park', 'Eldo View', 'Eldo Ridge Estate', 'Eldoraigne Aftreelandgoed', 'Kama Creek', 'La Borie', 'La Motte', 'Morningside', 'The Pines', 'Villa Reinette', 'Villa Shiane', 'Other'],
    'Hennopspark': ['Basoon Park', 'Bon Courage', 'Carmen', 'Ilanga', 'Jean Park', 'Karana', 'Katarina', 'Roosmaryn', 'Via Bianca', 'Other'],
    'Heuweloord': ['Arundo Estate', 'Heuwelsig Estate', 'Stone Gate', 'Thornfields', 'Other'],
    'Highveld': ['Corfu', 'Highveld Estate', 'Irene View Estate', 'Kariba', 'Porto Bella', 'Santorini', 'Sparrow Circle Estate', 'The Columns', 'Other'],
    'Irene': ['Cornwall Hill Estate', 'Irene Farm Villages', 'Irene Woods Estate', 'Southdowns Estate', 'Other'],
    'Kosmosdal': ['Blue Valley Golf Estate', 'Candlewoods Country Estate', 'Country View Estate', 'Summerfields', 'Other'],
    'Lyttelton': ['Baldersbronn', 'Brandwag', 'Clifton Hill', 'Fijnbos', 'Goedehoop', 'Kasteel', 'La-Vue', 'Laborie', 'Loucharl', 'Villa Martine', 'Other'],
    'Lyttelton Manor': ['Baldersbronn', 'Brandwag', 'Clifton Hill', 'Fijnbos', 'Goedehoop', 'Kasteel', 'La-Vue', 'Laborie', 'Loucharl', 'Villa Martine', 'Other'],
    'Midstream': ['Ascend to Midstream', 'Midfield Estate', 'Midlands Estate', 'Midstream Estate', 'Midstream Heights', 'Midstream Hill Estate', 'Midstream Meadows', 'Midstream Ridge Estate', 'Retire at Midstream', 'Other'],
    'Monavoni': ['Silverstone Estate', 'Stone Ridge Country Estate', 'Thatch Hill Estate', 'The Hudson Estate', 'Valley View Estate', 'Westwood', 'Other'],
    'Pierre van Ryneveld Park': ['De prestige', 'Rietvlei Heights Country Estate', 'Rietvlei Ridge Country Estate', 'Other'],
    'Rooihuiskraal': ['Amber Ridge', 'Anabranch', 'Avignon', 'Bavaria', 'Belgaum', 'Bianca Villas', 'Cabernet', 'Canterbury', 'Chablis', 'Chardonnay', 'Crafford Park', 'Crecy', 'Dulcian Manor', 'Eden Garden', 'Elkana', 'Fleur de Lis', 'Galloway', 'Jatoba', 'Kildare', 'Knoppiesdoring', 'Kubu', 'La Maison', 'La Terra de Luc', 'Lalaphanzi', 'Langebrigg', 'Lemonwood', 'Magaliesig', 'Marabu', 'Marantan', 'Mauritius', 'Montagu', 'Monte Villas', 'Mopanie', 'Oakhurst', 'Portugal', 'Provence', 'Raspberry', 'Robinhill', 'Rooihuiskraal-Noord (complex)', 'Rua Vista', 'Sahara Glen', 'Santelmo', 'Savannah', 'Serene', 'Serengeti', 'Shamrock', 'Silver Oaks', 'Stockholm Complex', 'Tehilla', 'Tugela', 'Umgeni', 'Verona', 'Villa Chemika', 'Villa d\'Alegria', 'Villa Serine', 'Villieria', 'Waterberg Fields', 'Willow Creek', 'Willow Haven', 'Willow Park', 'Willowdene', 'Willowvale', 'Zambezi', 'Other'],
    'Rooihuiskraal Noord': ['Amber Ridge', 'Anabranch', 'Avignon', 'Bavaria', 'Belgaum', 'Bianca Villas', 'Cabernet', 'Canterbury', 'Chablis', 'Chardonnay', 'Crafford Park', 'Crecy', 'Dulcian Manor', 'Eden Garden', 'Elkana', 'Fleur de Lis', 'Galloway', 'Jatoba', 'Kildare', 'Knoppiesdoring', 'Kubu', 'La Maison', 'La Terra de Luc', 'Lalaphanzi', 'Langebrigg', 'Lemonwood', 'Magaliesig', 'Marabu', 'Marantan', 'Mauritius', 'Montagu', 'Monte Villas', 'Mopanie', 'Oakhurst', 'Portugal', 'Provence', 'Raspberry', 'Robinhill', 'Rooihuiskraal-Noord (complex)', 'Rua Vista', 'Sahara Glen', 'Santelmo', 'Savannah', 'Serene', 'Serengeti', 'Shamrock', 'Silver Oaks', 'Stockholm Complex', 'Tehilla', 'Tugela', 'Umgeni', 'Verona', 'Villa Chemika', 'Villa d\'Alegria', 'Villa Serine', 'Villieria', 'Waterberg Fields', 'Willow Creek', 'Willow Haven', 'Willow Park', 'Willowdene', 'Willowvale', 'Zambezi', 'Other'],
    'Thatchfield': ['Thatchfield Estate', 'Thatchfield Ridge', 'Other'],
    'The Reeds': ['Alcade', 'Barrique', 'Brooklands Lifestyle Estate', 'Casa Grande', 'Casa Mia', 'Clarinet Ridge', 'Estann', 'Glenfields', 'Hereford Estate', 'Hill View', 'Hillstead', 'Hurlingham', 'Jade Park', 'Karmel', 'Morton Manor', 'Parksig', 'Presidentia', 'Riverside Estate', 'Saxby', 'Strelitzia', 'The Thornlands', 'Villa Corfu', 'Other'],
    'Wierda Park': ['Arnolds Creek', 'Battlefields', 'Bondev Park', 'Bronberg', 'Century Manor Estate', 'Wierda Glen Estate', 'Wierdaveld', 'Other'],
    'Zwartkop': ['Zwartkop Golf Estate', 'Other'],
};

export const midrandComplexes: Record<string, string[]> = {
    'Barbeque Downs': ['Cheshni', 'Jacana', 'Kyalami Hills', 'Millbrook', 'The Boulevard', 'The Edge', 'The Kyalami', 'The Poplar', 'The Racecourse', 'The Willows', 'Tinza', 'Other'],
    'Blue Hills': ['Afrivillage', 'Blue Hills Equestrian Estate', 'Blue Hills Ext', 'The Sheds @ Waterfall', 'Other'],
    'Carlswald': ['Carlswald Creek', 'Carlswald North Estate', 'Carlswald View', 'Cedar Roc', 'Crescentwood Estate', 'Crowthorne Estate', 'Hill of Good Hope', 'Le Mistral', 'Villa Toscana', 'Village-in-Carlswald', 'West End', 'Other'],
    'Country View': ['Cara Bianca', 'Country View Estate', 'Phoenix Regent Estate', 'The Heights Estate', 'Villa d\'Arc', 'Waterberg', 'Other'],
    'Crowthorne': ['The Paddocks', 'The Firs', 'The Willows', 'Other'],
    'Erand': ['Erand Court', 'Erand Mews', 'Phoenix View Estate', 'The Heights', 'Vodaworld Estate', 'Other'],
    'Glen Austin': ['Austin View', 'Glen Austin Estate', 'The Willows', 'Other'],
    'Halfway Gardens': ['Halfway Gardens Mews', 'Acacia', 'Broadwalk Crescent', 'Carlswald Meadows', 'Cascade', 'Hillstead', 'Lever Road', 'Matika', 'Midrand Village', 'The West End', 'Waterford complex', 'Other'],
    'Halfway House': ['Grand Apartments', 'Midrand Square', 'Parkview', 'The Grand', 'Other'],
    'Kyalami': ['Helderfontein Estate', 'Kyalami Estates', 'Kyalami Glen Estate', 'Kyalami Terrace', 'Saddlebrook Estate', 'The Whisken', 'Other'],
    'Noordwyk': ['Cottonwood', 'Decimus', 'Lake Xanadu', 'Noordwyk Manor', 'Sanridge', 'Silver Stream Estate', 'Summerset Hill', 'The Crescent', 'Other'],
    'President Park': ['Glen Acres Park Estate', 'Other'],
    'Summerset': ['Summerset Place', 'The Grace', 'Other'],
    'Vorna Valley': ['Le Roux', 'Silverwood', 'The Link', 'Villa Rondè', 'Waterfall Ridge', 'Other'],
    'Waterfall': ['Ellipse Waterfall', 'Kikuyu', 'The Munyaka', 'The Polofields', 'Waterfall Country Estate', 'Waterfall Country Village', 'Other'],
};

export const pretoriaComplexes: Record<string, string[]> = {
    'Boardwalk': ['Boardwalk Meander', 'Boardwalk Manor Estate', 'Boardwalk Villas', 'Other'],
    'Brooklyn': ['Brooklyn Stone', 'IQ Brooklyn', 'The Urban', 'The Village', 'Other'],
    'Constantia Park': ['Constantia Gardens', 'Constantia Mews', 'Constantia Place', 'Other'],
    'Equestria': ['Boulders', 'Equestria Estate', 'Paramount Estate', 'The Grove', 'Tygervalley', 'Willow Acres Estate', 'Other'],
    'Erasmuskloof': ['Castle Gate', 'Erasmus Park', 'Kloofsig', 'Other'],
    'Faerie Glen': ['The Paramount', 'Faerie Glen Village', 'Glenwood', 'The Glen', 'Valley Farm', 'Other'],
    'Garsfontein': ['Bella Vista', 'El Dòr', 'Garsfontein Park', 'The Glades', 'Woodlands Grove', 'Other'],
    'Hazelwood': ['The Club', 'The Village', 'Trilogy Collection', 'Other'],
    'Lynnwood': ['Lynnwood Manor Estate', 'Lynnwood Place', 'The Pad', 'Stratus', 'Other'],
    'Menlo Park': ['The Capital', 'The Hub', 'The Trilogy', 'Menlyn Maine Residences', 'Other'],
    'Moreleta Park': ['The Wilds', 'Moreleta Park Village', 'The Meadows', 'Olivewood', 'Hillside', 'Waterkloof View', 'Country Walk', 'Other'],
    'Newlands': ['Newlands Terrace', 'The Gables', 'Village on Charles', 'Other'],
    'Rietvalleirand': ['Rietvlei Heights Country Estate', 'Waterkloof Heights', 'Other'],
    'Silver Lakes': ['Silver Lakes Golf Estate', 'Lombardy Estate', 'Six Fountains Estate', 'Other'],
    'Wapadrand': ['Wapadrand Security Village', 'The Bataleur', 'Other'],
    'Waterkloof': ['Waterkloof Palms', 'The Ridge Estate', 'Waterkloof on Main', 'Waterkloof Marina', 'Other'],
    'Waterkloof Ridge': ['Waterkloof Palms', 'The Ridge Estate', 'Waterkloof on Main', 'Waterkloof Marina', 'Other'],
    'Amandasig': ['Amandasig Aftree Oord', 'Heatherdale', 'Other'],
    'Annlin': ['Annlin Place', 'Annlin Gardens', 'Crimson Cherry', 'Zambezi Manor', 'Other'],
    'Chantelle': ['Chantelle Park', 'Chantelle Mews', 'The Orchards', 'Other'],
    'Doornpoort': ['Doornpoort complex', 'Deo Gloria', 'Other'],
    'Karenpark': ['Akasia', 'Karenpark Crossing', 'The Orchards', 'Other'],
    'Montana': ['Zambezi Estate', 'Bougainvillea Estate', 'Montana Gardens', 'Sable Hills Waterfront Estate', 'Green Acres Estate', 'Monatana Tuine', 'Other'],
    'Sinoville': ['Sinoville Villas', 'Magaliesberg Country Estate', 'Stephanus', 'Other'],
    'Theresapark': ['Terra Gardens', 'Theresapark Estate', 'Valencia', 'Other'],
    'Arcadia': ['Union Buildings View', 'Hamilton Court', 'Arcadia Place', 'Loftus Versfeld', 'Other'],
    'Gezina': ['Roseville', 'Villeria', 'Other'],
    'Hatfield': ['Duncan Court', 'Festival\'s Edge', 'Hatfield Square', 'The Edge', 'Other'],
    'Muckleneuk': ['Groenkloof Estates', 'Muckleneuk Manor', 'The Diplomat', 'Fehrsen', 'Other'],
    'Groenkloof': ['Groenkloof Estates', 'Muckleneuk Manor', 'The Diplomat', 'Fehrsen', 'Other'],
    'Riviera': ['Riviera Mews', 'The Riviera', 'Other'],
    'Sunnyside': ['Sunny Court', 'Bultman', 'Jacaranda Park', 'Walker Street', 'Other'],
    'Danville': ['Danville Hof', 'Daspoort Villas', 'Elandspoort', 'Other'],
    'Daspoort': ['Danville Hof', 'Daspoort Villas', 'Elandspoort', 'Other'],
    'Kirkney': ['Kirkney Village', 'The Westview', 'Other'],
    'Pretoria West': ['West Park', 'WF Nkomo Village', 'Proclamation Hill', 'Other'],
    'Suiderberg': ['Suiderberg Mews', 'Suiderberg Villas', 'Other']
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
  user: UserProfile | null;
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
