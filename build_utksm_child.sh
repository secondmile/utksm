#!/bin/bash

set -e

# Set target directory
child_dir="/Users/YOUR_USERNAME_GOES_HERE/PATH_TO_SITES/utksm"

# Navigate to the target directory
cd "$child_dir"
echo "📂 Navigated to the target directory: $child_dir"

# Run npm build and wait for it to complete
npm run build
wait
echo "✅ Completed npm run build"

# Set source and destination paths
source_dir="build"
destination_dir="/Users/YOUR_USERNAME_GOES_HERE/PATH_TO_SITES/utk-admissions/app/public/wp-content/themes"

# Copy the build folder to the destination
cp -r "$source_dir" "$destination_dir"
echo "✅ Copied build folder to the destination: $destination_dir"

# Remove the existing 'utksm' directory
rm -rf "$destination_dir/utksm"
echo "✅ Removed the existing 'utksm' directory: $destination_dir/utksm"

# Rename the copied 'build' directory to 'utksm'
mv "$destination_dir/build" "$destination_dir/utksm"
echo "✅ Renamed the 'build' directory to 'utksm'"

# Child Theme Pattern Injection
# Set paths for copying patterns
parent_patterns_dir="$destination_dir/utkwds/patterns"
child_patterns_dir="$destination_dir/utksm/patterns"

# Check if child_patterns_dir exists
if [ -d "$destination_dir/utksm" ]; then
    # Copy patterns from utkwds to utksm
    cp -r "$parent_patterns_dir" "$child_patterns_dir"
    echo "✅ Copied patterns from '$parent_patterns_dir' to '$child_patterns_dir'"
else
    echo "❌ Destination patterns directory '$child_patterns_dir' does not exist."
fi

# Move files from patterns-sm to patterns (without overwriting)
child_patterns_unique_dir="$destination_dir/utksm/patterns-sm"
if [ -d "$child_patterns_unique_dir" ]; then
    for file in "$child_patterns_unique_dir"/*; do
        file_name=$(basename "$file")
        destination_file="$child_patterns_dir/$file_name"

        if [ -f "$destination_file" ]; then
            echo "Replacing $file_name"
            mv -n "$file" "$destination_file"
        else
            echo "Moving $file_name"
            mv "$file" "$child_patterns_dir/"
        fi
    done
    
    #remove the child patterns directory after moving the files over
    rm -rf "$child_patterns_unique_dir"
    
    echo "✅ Moved patterns from '$child_patterns_unique_dir' to '$child_patterns_dir'"
else
    echo "❌ Source patterns-sm directory '$child_patterns_unique_dir' does not exist."
fi

# Log the Injection
echo "🐝🔑 Pattern Injection from UTKWDS build to UTKSM build Complete"

# Display final console log
echo "🐝🔑 Build of UTKWDS | SM Child Theme | Complete"
