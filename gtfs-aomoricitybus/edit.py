import csv
import json

def read_trips_file(trips_file):
    trips_data = {}
    with open(trips_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            trip_id = row['trip_id']
            shape_id = row['shape_id']
            if shape_id not in trips_data:
                trips_data[shape_id] = []
            trips_data[shape_id].append(trip_id)
    return trips_data

def read_stop_times_file(stop_times_file):
    stops_data = {}
    with open(stop_times_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            trip_id = row['trip_id']
            stop_id = row['stop_id']
            if trip_id not in stops_data:
                stops_data[trip_id] = []
            stops_data[trip_id].append(stop_id)
    return stops_data

def generate_json(trips_data, stops_data):
    json_data = []
    for shape_id, trip_ids in trips_data.items():
        shape_info = {"shape_id": shape_id, "stops": []}
        for trip_id in trip_ids:
            if trip_id in stops_data:
                shape_info["stops"] += stops_data[trip_id]
        json_data.append(shape_info)
    return json_data

def main():
    trips_file_path = "C:\\Users\\user\\Downloads\\Toki-system.github.io\\Aomori_City_View\\gtfs-aomoricitybus\\trips.txt"
    stop_times_file_path = "C:\\Users\\user\\Downloads\\Toki-system.github.io\\Aomori_City_View\\gtfs-aomoricitybus\\stop_times.txt"
    
    trips_data = read_trips_file(trips_file_path)
    stops_data = read_stop_times_file(stop_times_file_path)
    
    json_data = generate_json(trips_data, stops_data)
    
    with open("output.json", "w") as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
