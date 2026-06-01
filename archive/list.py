import os

def save_file_list(root_dir, output_file, base_url=""):
    file_paths = []

    # Walk through all directories and files
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            # Build relative path
            rel_path = os.path.relpath(os.path.join(root, file), root_dir)
            # Convert Windows backslashes to forward slashes
            rel_path = rel_path.replace("\\", "/")
            # Add base URL if provided
            if base_url:
                full_path = f"{base_url}/{rel_path}"
            else:
                full_path = rel_path
            file_paths.append(f"'{full_path}',")

    # Save to text file
    with open(output_file, "w", encoding="utf-8") as f:
        for path in file_paths:
            f.write(path + "\n")

# Example usage
save_file_list(
    root_dir=".",  # folder to scan
    output_file="file_list.txt",
    base_url="https://warut92.github.io"  # optional, can be "" for relative paths
)
