import { SectorMetadata } from "../api";

// All planets list
export const allPlanets = [
	// Calaron sector planets
	{
		id: "planet-1",
		picture: "8",
		name: "Akrit'tar",
		location: { x: 0, y: 0.0900000036 },
	},
	{
		id: "planet-2",
		picture: "7",
		name: "F'tral",
		location: { x: 0.829999983, y: 0.930000007 },
	},
	{
		id: "planet-3",
		picture: "1",
		name: "Fwillsving",
		location: { x: 0.819999993, y: 0.0700000003 },
	},
	{
		id: "planet-4",
		picture: "13",
		name: "Ithor",
		location: { x: 0.389999986, y: 0.379999995 },
	},
	{
		id: "planet-5",
		picture: "14",
		name: "Jerijador",
		location: { x: 0.899999976, y: 0.629999995 },
	},
	{
		id: "planet-6",
		picture: "16",
		name: "Kessel",
		location: { x: 0.0199999996, y: 0.460000008 },
	},
	{
		id: "planet-7",
		picture: "17",
		name: "Kubindi",
		location: { x: 0.74000001, y: 0.340000004 },
	},
	{
		id: "planet-8",
		picture: "11",
		name: "Morvogodine",
		location: { x: 0.0700000003, y: 0.99000001 },
	},
	{
		id: "planet-9",
		picture: "4",
		name: "Norval II",
		location: { x: 0.0700000003, y: 0.730000019 },
	},
	{
		id: "planet-10",
		picture: "18",
		name: "Skor II",
		location: { x: 0.400000006, y: 0.889999986 },
	},
	// Churba sector planets
	{
		id: "planet-11",
		picture: "9",
		name: "Allyuen",
		location: { x: 0, y: 0.680000007 },
	},
	{
		id: "planet-12",
		picture: "13",
		name: "Anoat",
		location: { x: 0.860000014, y: 0.469999999 },
	},
	{
		id: "planet-13",
		picture: "15",
		name: "Bespin",
		location: { x: 0.779999971, y: 0.209999993 },
	},
	{
		id: "planet-14",
		picture: "7",
		name: "Deyer",
		location: { x: 0.460000008, y: 0.310000002 },
	},
	{
		id: "planet-15",
		picture: "14",
		name: "Gentes",
		location: { x: 0.0900000036, y: 0.400000006 },
	},
	{
		id: "planet-16",
		picture: "18",
		name: "Hoth",
		location: { x: 0.409999996, y: 0.689999998 },
	},
	{
		id: "planet-17",
		picture: "19",
		name: "Lelmra",
		location: { x: 0, y: 0.0700000003 },
	},
	{
		id: "planet-18",
		picture: "20",
		name: "New Cov",
		location: { x: 0.790000021, y: 0.810000002 },
	},
	{
		id: "planet-19",
		picture: "8",
		name: "Storthus",
		location: { x: 0.140000001, y: 0.939999998 },
	},
	{
		id: "planet-20",
		picture: "13",
		name: "Tokmia",
		location: { x: 0.349999994, y: 0.0500000007 },
	},
	// Corellian sector planets
	{
		id: "planet-21",
		picture: "5",
		name: "Commenor",
		location: { x: 0.50999999, y: 0.180000007 },
	},
	{
		id: "planet-22",
		picture: "6",
		name: "Corellia",
		location: { x: 0.899999976, y: 0.280000001 },
	},
	{
		id: "planet-23",
		picture: "1",
		name: "Corfai",
		location: { x: 0.119999997, y: 0.839999974 },
	},
	{
		id: "planet-24",
		picture: "3",
		name: "Drall",
		location: { x: 0.100000001, y: 0.330000013 },
	},
	{
		id: "planet-25",
		picture: "2",
		name: "Duros",
		location: { x: 0.720000029, y: 0.649999976 },
	},
	{
		id: "planet-26",
		picture: "7",
		name: "Selonia",
		location: { x: 0.449999988, y: 0.49000001 },
	},
	{
		id: "planet-27",
		picture: "4",
		name: "Talus",
		location: { x: 0.0299999993, y: 0.589999974 },
	},
	{
		id: "planet-28",
		picture: "5",
		name: "Tralus",
		location: { x: 0.769999981, y: 0.910000026 },
	},
	{
		id: "planet-29",
		picture: "6",
		name: "Vagran",
		location: { x: 0.430000007, y: 0.99000001 },
	},
	{
		id: "planet-30",
		picture: "1",
		name: "Xyquine",
		location: { x: 0.170000002, y: 0.0700000003 },
	},
	// Dufilvan sector planets
	{
		id: "planet-31",
		picture: "9",
		name: "Algarian",
		location: { x: 0.289999992, y: 0.430000007 },
	},
	{
		id: "planet-32",
		picture: "4",
		name: "Filve",
		location: { x: 0.769999981, y: 0.100000001 },
	},
	{
		id: "planet-33",
		picture: "5",
		name: "Gamorr",
		location: { x: 0.920000017, y: 0.569999993 },
	},
	{
		id: "planet-34",
		picture: "11",
		name: "Klatooine",
		location: { x: 0.129999995, y: 0.920000017 },
	},
	{
		id: "planet-35",
		picture: "19",
		name: "Ord Mantell",
		location: { x: 0.50999999, y: 0.939999998 },
	},
	{
		id: "planet-36",
		picture: "6",
		name: "Ord Pardon",
		location: { x: 0.959999979, y: 1 },
	},
	{
		id: "planet-37",
		picture: "1",
		name: "Ord Trasi",
		location: { x: 0.379999995, y: 0.159999996 },
	},
	{
		id: "planet-38",
		picture: "13",
		name: "Toprawa",
		location: { x: 0.569999993, y: 0.660000026 },
	},
	{
		id: "planet-39",
		picture: "19",
		name: "Womrik",
		location: { x: 0.0500000007, y: 0.660000026 },
	},
	{
		id: "planet-40",
		picture: "11",
		name: "Zebitrope IV",
		location: { x: 0, y: 0.0599999987 },
	},
	// Mayagil sector planets
	{
		id: "planet-41",
		picture: "19",
		name: "Anchoron",
		location: { x: 0.99000001, y: 0.99000001 },
	},
	{
		id: "planet-42",
		picture: "14",
		name: "Chalcedon",
		location: { x: 0.879999995, y: 0.419999987 },
	},
	{
		id: "planet-43",
		picture: "22",
		name: "Clak'dor VII",
		location: { x: 0.100000001, y: 0.709999979 },
	},
	{
		id: "planet-44",
		picture: "9",
		name: "Cona",
		location: { x: 0.349999994, y: 0.479999989 },
	},
	{
		id: "planet-45",
		picture: "11",
		name: "Dantooine",
		location: { x: 0.699999988, y: 0.709999979 },
	},
	{
		id: "planet-46",
		picture: "13",
		name: "H'nemthe",
		location: { x: 0.449999988, y: 0.209999993 },
	},
	{
		id: "planet-47",
		picture: "3",
		name: "Kabal",
		location: { x: 0.0700000003, y: 0.0599999987 },
	},
	{
		id: "planet-48",
		picture: "11",
		name: "Öetrago",
		location: { x: 0.819999993, y: 0.0900000036 },
	},
	{
		id: "planet-49",
		picture: "8",
		name: "Triton",
		location: { x: 0.0299999993, y: 0.400000006 },
	},
	{
		id: "planet-50",
		picture: "18",
		name: "Urdur",
		location: { x: 0.389999986, y: 0.930000007 },
	},
	// Moddell sector planets
	{
		id: "planet-51",
		picture: "4",
		name: "Adega",
		location: { x: 0.360000014, y: 0.150000006 },
	},
	{
		id: "planet-52",
		picture: "20",
		name: "Agrilat",
		location: { x: 0.75, y: 0.0199999996 },
	},
	{
		id: "planet-53",
		picture: "15",
		name: "Annaj",
		location: { x: 0.00999999978, y: 0.600000024 },
	},
	{
		id: "planet-54",
		picture: "8",
		name: "Basilisk",
		location: { x: 0.0700000003, y: 0.319999993 },
	},
	{
		id: "planet-55",
		picture: "13",
		name: "Endor",
		location: { x: 0.730000019, y: 0.540000021 },
	},
	{
		id: "planet-56",
		picture: "8",
		name: "Gandolo IV",
		location: { x: 0.170000002, y: 0.959999979 },
	},
	{
		id: "planet-57",
		picture: "8",
		name: "Hozrel XI",
		location: { x: 0.660000026, y: 0.879999995 },
	},
	{
		id: "planet-58",
		picture: "19",
		name: "Khuiumin",
		location: { x: 0.409999996, y: 0.439999998 },
	},
	{
		id: "planet-59",
		picture: "13",
		name: "Pzob",
		location: { x: 0.319999993, y: 0.699999988 },
	},
	{
		id: "planet-60",
		picture: "8",
		name: "Vjun",
		location: { x: 0.899999976, y: 0.280000001 },
	},
	// Orus sector planets
	{
		id: "planet-61",
		picture: "5",
		name: "Bakura",
		location: { x: 0.389999986, y: 0.889999986 },
	},
	{
		id: "planet-62",
		picture: "19",
		name: "Chazwa",
		location: { x: 0.209999993, y: 0.639999986 },
	},
	{
		id: "planet-63",
		picture: "13",
		name: "Daltar",
		location: { x: 0.939999998, y: 0.439999998 },
	},
	{
		id: "planet-64",
		picture: "6",
		name: "Joiol",
		location: { x: 0.730000019, y: 0.0399999991 },
	},
	{
		id: "planet-65",
		picture: "13",
		name: "Kimanan",
		location: { x: 0.0399999991, y: 0.920000017 },
	},
	{
		id: "planet-66",
		picture: "1",
		name: "Lafra",
		location: { x: 0.170000002, y: 0.0900000036 },
	},
	{
		id: "planet-67",
		picture: "20",
		name: "Mantessa",
		location: { x: 0.479999989, y: 0.349999994 },
	},
	{
		id: "planet-68",
		picture: "8",
		name: "Poderis",
		location: { x: 0.709999979, y: 0.99000001 },
	},
	{
		id: "planet-69",
		picture: "19",
		name: "Ryloth",
		location: { x: 0.819999993, y: 0.720000029 },
	},
	{
		id: "planet-70",
		picture: "9",
		name: "Tatooine",
		location: { x: 0.00999999978, y: 0.379999995 },
	},
	// Sesswenna sector planets
	{
		id: "planet-71",
		picture: "19",
		name: "Averam",
		location: { x: 0.0799999982, y: 0.409999996 },
	},
	{
		id: "planet-72",
		picture: "11",
		name: "Balmorra",
		location: { x: 0.300000012, y: 0.790000021 },
	},
	{
		id: "planet-73",
		picture: "6",
		name: "Bortras",
		location: { x: 0.620000005, y: 0.99000001 },
	},
	{
		id: "planet-74",
		picture: "23",
		name: "Coruscant",
		location: { x: 0.5, y: 0.449999988 },
	},
	{
		id: "planet-75",
		picture: "13",
		name: "Chandrila",
		location: { x: 0.00999999978, y: 0.119999997 },
	},
	{
		id: "planet-76",
		picture: "1",
		name: "Corsin",
		location: { x: 0.980000019, y: 0.660000026 },
	},
	{
		id: "planet-77",
		picture: "2",
		name: "Ghorman",
		location: { x: 0.910000026, y: 0.25999999 },
	},
	{
		id: "planet-78",
		picture: "3",
		name: "Svivren",
		location: { x: 0.0199999996, y: 0.99000001 },
	},
	{
		id: "planet-79",
		picture: "13",
		name: "Uvena",
		location: { x: 0.639999986, y: 0.730000019 },
	},
	{
		id: "planet-80",
		picture: "4",
		name: "Yaga Minor",
		location: { x: 0.449999988, y: 0.0700000003 },
	},
	// Sluis sector planets
	{
		id: "planet-81",
		picture: "1",
		name: "Bothawui",
		location: { x: 0.50999999, y: 0.159999996 },
	},
	{
		id: "planet-82",
		picture: "1",
		name: "Bpfassh",
		location: { x: 0.0799999982, y: 0.670000017 },
	},
	{
		id: "planet-83",
		picture: "1",
		name: "Denab",
		location: { x: 0.75, y: 0.889999986 },
	},
	{
		id: "planet-84",
		picture: "1",
		name: "Kothlis",
		location: { x: 0.600000024, y: 0.419999987 },
	},
	{
		id: "planet-85",
		picture: "1",
		name: "Mon Calamari",
		location: { x: 0.430000007, y: 0.670000017 },
	},
	{
		id: "planet-86",
		picture: "1",
		name: "Orto",
		location: { x: 0.170000002, y: 0.319999993 },
	},
	{
		id: "planet-87",
		picture: "1",
		name: "Praesitlyn",
		location: { x: 0.289999992, y: 0.980000019 },
	},
	{
		id: "planet-88",
		picture: "1",
		name: "Sluis Van",
		location: { x: 0.930000007, y: 0.119999997 },
	},
	{
		id: "planet-89",
		picture: "1",
		name: "Sullust",
		location: { x: 0.00999999978, y: 0.0599999987 },
	},
	{
		id: "planet-90",
		picture: "1",
		name: "Umgul",
		location: { x: 0.930000007, y: 0.550000012 },
	},
	// Sumitra sector planets
	{
		id: "planet-91",
		picture: "1",
		name: "Alk'lellish III",
		location: { x: 0.100000001, y: 1 },
	},
	{
		id: "planet-92",
		picture: "1",
		name: "Boordii",
		location: { x: 0.389999986, y: 0.860000014 },
	},
	{
		id: "planet-93",
		picture: "1",
		name: "Flax",
		location: { x: 0.0500000007, y: 0.600000024 },
	},
	{
		id: "planet-94",
		picture: "1",
		name: "Geedon V",
		location: { x: 0.300000012, y: 0.360000014 },
	},
	{
		id: "planet-95",
		picture: "1",
		name: "Kashyyyk",
		location: { x: 0.400000006, y: 0.0900000036 },
	},
	{
		id: "planet-96",
		picture: "1",
		name: "Linuri",
		location: { x: 0.910000026, y: 0.200000003 },
	},
	{
		id: "planet-97",
		picture: "1",
		name: "Qat Chrystac",
		location: { x: 0.860000014, y: 0.610000014 },
	},
	{
		id: "planet-98",
		picture: "1",
		name: "Tierfon",
		location: { x: 0.0599999987, y: 0.0700000003 },
	},
	{
		id: "planet-99",
		picture: "1",
		name: "Woostri",
		location: { x: 0.730000019, y: 0.879999995 },
	},
	{
		id: "planet-100",
		picture: "1",
		name: "Yavin",
		location: { x: 0.5, y: 0.610000014 },
	},
	// Medium galaxy additional planets
	// Farfin sector planets
	{
		id: "planet-101",
		picture: "1",
		name: "Bilbringi",
		location: { x: 0.0500000007, y: 0.430000007 },
	},
	{
		id: "planet-102",
		picture: "1",
		name: "Byss",
		location: { x: 0.189999998, y: 0.699999988 },
	},
	{
		id: "planet-103",
		picture: "1",
		name: "Charmath",
		location: { x: 0.870000005, y: 0.930000007 },
	},
	{
		id: "planet-104",
		picture: "1",
		name: "Firro",
		location: { x: 0.839999974, y: 0.0700000003 },
	},
	{
		id: "planet-105",
		picture: "1",
		name: "Khomm",
		location: { x: 0.389999986, y: 0.119999997 },
	},
	{
		id: "planet-106",
		picture: "1",
		name: "Kinyen",
		location: { x: 0.629999995, y: 0.670000017 },
	},
	{
		id: "planet-107",
		picture: "1",
		name: "Phraetiss",
		location: { x: 0.479999989, y: 0.400000006 },
	},
	{
		id: "planet-108",
		picture: "1",
		name: "Rishi",
		location: { x: 0.419999987, y: 0.939999998 },
	},
	{
		id: "planet-109",
		picture: "1",
		name: "Taanab",
		location: { x: 0.860000014, y: 0.360000014 },
	},
	{
		id: "planet-110",
		picture: "1",
		name: "Wistril",
		location: { x: 0.0299999993, y: 0.150000006 },
	},
	// Glythe sector planets
	{
		id: "planet-111",
		picture: "1",
		name: "Altarrn",
		location: { x: 0.74000001, y: 0.209999993 },
	},
	{
		id: "planet-112",
		picture: "1",
		name: "Arkania",
		location: { x: 0.889999986, y: 0.479999989 },
	},
	{
		id: "planet-113",
		picture: "1",
		name: "Elrood",
		location: { x: 0.150000006, y: 0.370000005 },
	},
	{
		id: "planet-114",
		picture: "1",
		name: "Fef",
		location: { x: 0.959999979, y: 0.810000002 },
	},
	{
		id: "planet-115",
		picture: "1",
		name: "Fornax",
		location: { x: 0.449999988, y: 0.850000024 },
	},
	{
		id: "planet-116",
		picture: "1",
		name: "Nentan",
		location: { x: 0, y: 0.0799999982 },
	},
	{
		id: "planet-117",
		picture: "1",
		name: "Sedri",
		location: { x: 0.0199999996, y: 0.959999979 },
	},
	{
		id: "planet-118",
		picture: "1",
		name: "Valrar",
		location: { x: 0.560000002, y: 0.579999983 },
	},
	{
		id: "planet-119",
		picture: "1",
		name: "Vortex",
		location: { x: 0.379999995, y: 0.150000006 },
	},
	{
		id: "planet-120",
		picture: "1",
		name: "Yag'Dhul",
		location: { x: 0, y: 0.649999976 },
	},
	// Jospro sector planets
	{
		id: "planet-121",
		picture: "1",
		name: "Azbian",
		location: { x: 0.850000024, y: 0.870000005 },
	},
	{
		id: "planet-122",
		picture: "1",
		name: "Cardooine",
		location: { x: 0.449999988, y: 0.0900000036 },
	},
	{
		id: "planet-123",
		picture: "1",
		name: "Chrondre",
		location: { x: 0.0199999996, y: 0.0599999987 },
	},
	{
		id: "planet-124",
		picture: "1",
		name: "Dar'Or",
		location: { x: 0.330000013, y: 0.349999994 },
	},
	{
		id: "planet-125",
		picture: "1",
		name: "Douglas III",
		location: { x: 0.479999989, y: 0.970000029 },
	},
	{
		id: "planet-126",
		picture: "1",
		name: "Engira",
		location: { x: 0.0599999987, y: 0.860000014 },
	},
	{
		id: "planet-127",
		picture: "1",
		name: "Jomark",
		location: { x: 0.5, y: 0.720000029 },
	},
	{
		id: "planet-128",
		picture: "1",
		name: "Kiffex",
		location: { x: 0.829999983, y: 0.109999999 },
	},
	{
		id: "planet-129",
		picture: "1",
		name: "Trogan",
		location: { x: 0.959999979, y: 0.400000006 },
	},
	{
		id: "planet-130",
		picture: "1",
		name: "Waskiro",
		location: { x: 0.159999996, y: 0.600000024 },
	},
	// Kanchen sector planets
	{
		id: "planet-131",
		picture: "1",
		name: "Culroon III",
		location: { x: 0.949999988, y: 0.150000006 },
	},
	{
		id: "planet-132",
		picture: "1",
		name: "Davnar",
		location: { x: 0.0199999996, y: 0.850000024 },
	},
	{
		id: "planet-133",
		picture: "1",
		name: "Derra IV",
		location: { x: 0.569999993, y: 0.289999992 },
	},
	{
		id: "planet-134",
		picture: "1",
		name: "Mindar",
		location: { x: 0.340000004, y: 0.74000001 },
	},
	{
		id: "planet-135",
		picture: "1",
		name: "Munto Codru",
		location: { x: 0.25999999, y: 0.5 },
	},
	{
		id: "planet-136",
		picture: "1",
		name: "Nal Hutta",
		location: { x: 0.49000001, y: 0.99000001 },
	},
	{
		id: "planet-137",
		picture: "1",
		name: "Smarteel",
		location: { x: 0.810000002, y: 0.879999995 },
	},
	{
		id: "planet-138",
		picture: "1",
		name: "Spuma",
		location: { x: 0.899999976, y: 0.409999996 },
	},
	{
		id: "planet-139",
		picture: "1",
		name: "Vodran",
		location: { x: 0.180000007, y: 0.25 },
	},
	{
		id: "planet-140",
		picture: "1",
		name: "Xa Fel",
		location: { x: 0.0199999996, y: 0.0199999996 },
	},
	// Quelli sector planets
	{
		id: "planet-141",
		picture: "1",
		name: "Amorris",
		location: { x: 0.819999993, y: 0.319999993 },
	},
	{
		id: "planet-142",
		picture: "1",
		name: "Corstris",
		location: { x: 0.769999981, y: 0.649999976 },
	},
	{
		id: "planet-143",
		picture: "1",
		name: "Dathomir",
		location: { x: 0.170000002, y: 0.959999979 },
	},
	{
		id: "planet-144",
		picture: "1",
		name: "Kirrek",
		location: { x: 0.389999986, y: 0.119999997 },
	},
	{
		id: "planet-145",
		picture: "1",
		name: "Pil Diller",
		location: { x: 0.00999999978, y: 0.709999979 },
	},
	{
		id: "planet-146",
		picture: "1",
		name: "Rafa",
		location: { x: 0.0599999987, y: 0.280000001 },
	},
	{
		id: "planet-147",
		picture: "1",
		name: "Selaggis",
		location: { x: 1, y: 0.970000029 },
	},
	{
		id: "planet-148",
		picture: "1",
		name: "Thrakia",
		location: { x: 0.419999987, y: 0.730000019 },
	},
	{
		id: "planet-149",
		picture: "1",
		name: "Varn",
		location: { x: 0.280000001, y: 0.50999999 },
	},
	{
		id: "planet-150",
		picture: "1",
		name: "Vinsoth",
		location: { x: 0.550000012, y: 1 },
	},
	// Large galaxy additional planets
	// Abrion sector planets
	{
		id: "planet-151",
		picture: "1",
		name: "Abregado",
		location: { x: 0.100000001, y: 0.980000019 },
	},
	{
		id: "planet-152",
		picture: "1",
		name: "Cathar",
		location: { x: 0.529999971, y: 0.569999993 },
	},
	{
		id: "planet-153",
		picture: "1",
		name: "Da Soocha",
		location: { x: 0.720000029, y: 0.0399999991 },
	},
	{
		id: "planet-154",
		picture: "1",
		name: "Galpos II",
		location: { x: 0.50999999, y: 0.850000024 },
	},
	{
		id: "planet-155",
		picture: "1",
		name: "Garban",
		location: { x: 0.910000026, y: 0.560000002 },
	},
	{
		id: "planet-156",
		picture: "1",
		name: "Hefi",
		location: { x: 0.0500000007, y: 0.670000017 },
	},
	{
		id: "planet-157",
		picture: "1",
		name: "Hishyim",
		location: { x: 0.270000011, y: 0.150000006 },
	},
	{
		id: "planet-158",
		picture: "1",
		name: "Intuci",
		location: { x: 0.949999988, y: 0.870000005 },
	},
	{
		id: "planet-159",
		picture: "1",
		name: "Tieos",
		location: { x: 0.689999998, y: 0.300000012 },
	},
	{
		id: "planet-160",
		picture: "1",
		name: "Ukio",
		location: { x: 0.0599999987, y: 0.400000006 },
	},
	// Atrivis sector planets
	{
		id: "planet-161",
		picture: "1",
		name: "Despayre",
		location: { x: 0.5, y: 0.720000029 },
	},
	{
		id: "planet-162",
		picture: "1",
		name: "Fedje",
		location: { x: 0.949999988, y: 0.150000006 },
	},
	{
		id: "planet-163",
		picture: "1",
		name: "Generis",
		location: { x: 0.949999988, y: 0.540000021 },
	},
	{
		id: "planet-164",
		picture: "1",
		name: "Moltok",
		location: { x: 0.159999996, y: 0.409999996 },
	},
	{
		id: "planet-165",
		picture: "1",
		name: "Nam'ta",
		location: { x: 0.200000003, y: 0.959999979 },
	},
	{
		id: "planet-166",
		picture: "1",
		name: "Spefik",
		location: { x: 0.680000007, y: 0.400000006 },
	},
	{
		id: "planet-167",
		picture: "1",
		name: "Tibrin",
		location: { x: 0.449999988, y: 0.159999996 },
	},
	{
		id: "planet-168",
		picture: "1",
		name: "Togoria",
		location: { x: 0.00999999978, y: 0.689999998 },
	},
	{
		id: "planet-169",
		picture: "1",
		name: "Trammis",
		location: { x: 0.620000005, y: 0.980000019 },
	},
	{
		id: "planet-170",
		picture: "1",
		name: "Zeffliffl",
		location: { x: 0.100000001, y: 0.0700000003 },
	},
	// Dolomar sector planets
	{
		id: "planet-171",
		picture: "1",
		name: "Balfron",
		location: { x: 0.100000001, y: 0.889999986 },
	},
	{
		id: "planet-172",
		picture: "1",
		name: "Caprionril",
		location: { x: 0.860000014, y: 0.99000001 },
	},
	{
		id: "planet-173",
		picture: "1",
		name: "Kamparas",
		location: { x: 0.129999995, y: 0.319999993 },
	},
	{
		id: "planet-174",
		picture: "1",
		name: "Ketaris",
		location: { x: 0, y: 0.589999974 },
	},
	{
		id: "planet-175",
		picture: "1",
		name: "Omwat",
		location: { x: 0.50999999, y: 0.850000024 },
	},
	{
		id: "planet-176",
		picture: "1",
		name: "Pantolomin",
		location: { x: 0.50999999, y: 0.0599999987 },
	},
	{
		id: "planet-177",
		picture: "1",
		name: "Phorliss",
		location: { x: 0.0399999991, y: 0.0900000036 },
	},
	{
		id: "planet-178",
		picture: "1",
		name: "Sarka",
		location: { x: 0.889999986, y: 0.449999988 },
	},
	{
		id: "planet-179",
		picture: "1",
		name: "Tangrene",
		location: { x: 0.569999993, y: 0.400000006 },
	},
	{
		id: "planet-180",
		picture: "1",
		name: "Wor Tandell",
		location: { x: 0.860000014, y: 0.180000007 },
	},
	// Fakir sector planets
	{
		id: "planet-181",
		picture: "1",
		name: "Ando",
		location: { x: 0.860000014, y: 0.0700000003 },
	},
	{
		id: "planet-182",
		picture: "1",
		name: "Berchest",
		location: { x: 0.709999979, y: 0.330000013 },
	},
	{
		id: "planet-183",
		picture: "1",
		name: "Bimmisaari",
		location: { x: 0.150000006, y: 0.939999998 },
	},
	{
		id: "planet-184",
		picture: "1",
		name: "Carida",
		location: { x: 0.389999986, y: 0.649999976 },
	},
	{
		id: "planet-185",
		picture: "1",
		name: "Delaya",
		location: { x: 0.0199999996, y: 0.150000006 },
	},
	{
		id: "planet-186",
		picture: "1",
		name: "Halowan",
		location: { x: 0.730000019, y: 0.709999979 },
	},
	{
		id: "planet-187",
		picture: "1",
		name: "Mrisst",
		location: { x: 0.0599999987, y: 0.680000007 },
	},
	{
		id: "planet-188",
		picture: "1",
		name: "Obroa-skai",
		location: { x: 0.319999993, y: 0.319999993 },
	},
	{
		id: "planet-189",
		picture: "1",
		name: "Palanhi",
		location: { x: 0.519999981, y: 0.0199999996 },
	},
	{
		id: "planet-190",
		picture: "1",
		name: "Ralltiir",
		location: { x: 0.649999976, y: 0.959999979 },
	},
	// Xappyh sector planets
	{
		id: "planet-191",
		picture: "1",
		name: "Ambria",
		location: { x: 0.370000005, y: 0.25999999 },
	},
	{
		id: "planet-192",
		picture: "1",
		name: "G'rho",
		location: { x: 0.689999998, y: 0.330000013 },
	},
	{
		id: "planet-193",
		picture: "1",
		name: "Kirdo III",
		location: { x: 0.370000005, y: 0.899999976 },
	},
	{
		id: "planet-194",
		picture: "1",
		name: "Neelgaimon",
		location: { x: 0.810000002, y: 0.839999974 },
	},
	{
		id: "planet-195",
		picture: "1",
		name: "Norulac",
		location: { x: 0.100000001, y: 0.400000006 },
	},
	{
		id: "planet-196",
		picture: "1",
		name: "Ruuria",
		location: { x: 0.949999988, y: 0.0599999987 },
	},
	{
		id: "planet-197",
		picture: "1",
		name: "Stic",
		location: { x: 0.460000008, y: 0.600000024 },
	},
	{
		id: "planet-198",
		picture: "1",
		name: "Thanta Zilbra",
		location: { x: 0.0799999982, y: 0 },
	},
	{
		id: "planet-199",
		picture: "1",
		name: "Thila",
		location: { x: 0.0500000007, y: 0.99000001 },
	},
	{
		id: "planet-200",
		picture: "1",
		name: "Tund",
		location: { x: 0.889999986, y: 0.560000002 },
	},
];

// Small sectors for small galaxy size
export const smallSectors: SectorMetadata[] = [
	{
		id: "calaron",
		name: "Calaron",
		isInnerRim: false,
		location: { x: 0.419999987, y: 0.0700000003 },
		planetIds: [
			"planet-1", "planet-2", "planet-3", "planet-4", "planet-5",
			"planet-6", "planet-7", "planet-8", "planet-9", "planet-10"
		],
	},
	{
		id: "churba",
		name: "Churba",
		isInnerRim: false,
		location: { x: 0.00999999978, y: 0.469999999 },
		planetIds: [
			"planet-11", "planet-12", "planet-13", "planet-14", "planet-15",
			"planet-16", "planet-17", "planet-18", "planet-19", "planet-20"
		],
	},
	{
		id: "corellian",
		name: "Corellian",
		isInnerRim: true,
		location: { x: 0.230000004, y: 0.460000008 },
		planetIds: [
			"planet-21", "planet-22", "planet-23", "planet-24", "planet-25",
			"planet-26", "planet-27", "planet-28", "planet-29", "planet-30"
		],
	},
	{
		id: "dufilvan",
		name: "Dufilvan",
		isInnerRim: false,
		location: { x: 0.389999986, y: 0.860000014 },
		planetIds: [
			"planet-31", "planet-32", "planet-33", "planet-34", "planet-35",
			"planet-36", "planet-37", "planet-38", "planet-39", "planet-40"
		],
	},
	{
		id: "mayagil",
		name: "Mayagil",
		isInnerRim: false,
		location: { x: 0.610000014, y: 0.0700000003 },
		planetIds: [
			"planet-41", "planet-42", "planet-43", "planet-44", "planet-45",
			"planet-46", "planet-47", "planet-48", "planet-49", "planet-50"
		],
	},
	{
		id: "moddell",
		name: "Moddell",
		isInnerRim: false,
		location: { x: 0.119999997, y: 0.0900000036 },
		planetIds: [
			"planet-51", "planet-52", "planet-53", "planet-54", "planet-55",
			"planet-56", "planet-57", "planet-58", "planet-59", "planet-60"
		],
	},
	{
		id: "orus",
		name: "Orus",
		isInnerRim: false,
		location: { x: 0.920000017, y: 0.910000026 },
		planetIds: [
			"planet-61", "planet-62", "planet-63", "planet-64", "planet-65",
			"planet-66", "planet-67", "planet-68", "planet-69", "planet-70"
		],
	},
	{
		id: "sesswenna",
		name: "Sesswenna",
		isInnerRim: true,
		location: { x: 0.319999993, y: 0.25 },
		planetIds: [
			"planet-71", "planet-72", "planet-73", "planet-74", "planet-75",
			"planet-76", "planet-77", "planet-78", "planet-79", "planet-80"
		],
	},
	{
		id: "sluis",
		name: "Sluis",
		isInnerRim: true,
		location: { x: 0.660000026, y: 0.660000026 },
		planetIds: [
			"planet-81", "planet-82", "planet-83", "planet-84", "planet-85",
			"planet-86", "planet-87", "planet-88", "planet-89", "planet-90"
		],
	},
	{
		id: "sumitra",
		name: "Sumitra",
		isInnerRim: false,
		location: { x: 0.970000029, y: 0.529999971 },
		planetIds: [
			"planet-91", "planet-92", "planet-93", "planet-94", "planet-95",
			"planet-96", "planet-97", "planet-98", "planet-99", "planet-100"
		],
	},
];

// Medium sectors includes all small sectors plus additional sectors
export const mediumSectors: SectorMetadata[] = [
	...smallSectors,
	{
		id: "farfin",
		name: "Farfin",
		isInnerRim: true,
		location: { x: 0.75999999, y: 0.419999987 },
		planetIds: [
			"planet-101", "planet-102", "planet-103", "planet-104", "planet-105",
			"planet-106", "planet-107", "planet-108", "planet-109", "planet-110"
		],
	},
	{
		id: "glythe",
		name: "Glythe",
		isInnerRim: false,
		location: { x: 0.769999981, y: 0.25 },
		planetIds: [
			"planet-111", "planet-112", "planet-113", "planet-114", "planet-115",
			"planet-116", "planet-117", "planet-118", "planet-119", "planet-120"
		],
	},
	{
		id: "jospro",
		name: "Jospro",
		isInnerRim: false,
		location: { x: 1.0, y: 0.680000007 },
		planetIds: [
			"planet-121", "planet-122", "planet-123", "planet-124", "planet-125",
			"planet-126", "planet-127", "planet-128", "planet-129", "planet-130"
		],
	},
	{
		id: "kanchen",
		name: "Kanchen",
		isInnerRim: false,
		location: { x: 0.180000007, y: 0.720000029 },
		planetIds: [
			"planet-131", "planet-132", "planet-133", "planet-134", "planet-135",
			"planet-136", "planet-137", "planet-138", "planet-139", "planet-140"
		],
	},
	{
		id: "quelli",
		name: "Quelli",
		isInnerRim: false,
		location: { x: 0.0, y: 0.280000001 },
		planetIds: [
			"planet-141", "planet-142", "planet-143", "planet-144", "planet-145",
			"planet-146", "planet-147", "planet-148", "planet-149", "planet-150"
		],
	},
];

// Large sectors includes all medium sectors plus additional sectors
export const largeSectors: SectorMetadata[] = [
	...mediumSectors,
	{
		id: "abrion",
		name: "Abrion",
		isInnerRim: false,
		location: { x: 0.569999993, y: 0.819999993 },
		planetIds: [
			"planet-151", "planet-152", "planet-153", "planet-154", "planet-155",
			"planet-156", "planet-157", "planet-158", "planet-159", "planet-160"
		],
	},
	{
		id: "atrivis",
		name: "Atrivis",
		isInnerRim: false,
		location: { x: 0.25999999, y: 0.0 },
		planetIds: [
			"planet-161", "planet-162", "planet-163", "planet-164", "planet-165",
			"planet-166", "planet-167", "planet-168", "planet-169", "planet-170"
		],
	},
	{
		id: "dolomar",
		name: "Dolomar",
		isInnerRim: true,
		location: { x: 0.579999983, y: 0.25 },
		planetIds: [
			"planet-171", "planet-172", "planet-173", "planet-174", "planet-175",
			"planet-176", "planet-177", "planet-178", "planet-179", "planet-180"
		],
	},
	{
		id: "fakir",
		name: "Fakir",
		isInnerRim: true,
		location: { x: 0.430000007, y: 0.649999976 },
		planetIds: [
			"planet-181", "planet-182", "planet-183", "planet-184", "planet-185",
			"planet-186", "planet-187", "planet-188", "planet-189", "planet-190"
		],
	},
	{
		id: "xappyh",
		name: "Xappyh",
		isInnerRim: false,
		location: { x: 0.74000001, y: 1.0 },
		planetIds: [
			"planet-191", "planet-192", "planet-193", "planet-194", "planet-195",
			"planet-196", "planet-197", "planet-198", "planet-199", "planet-200"
		],
	},
];
