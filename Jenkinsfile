def runCypressChunk(index, totalChunks) {
  sh """
    mkdir -p cypress/results
    echo "Splitting specs for chunk ${index}/${totalChunks}"
    node -e "
      const fs = require('fs');
      const glob = require('glob');
      const specs = glob.sync('cypress/e2e/**/*.spec.js').sort();
      const chunkSize = Math.ceil(specs.length / ${totalChunks});
      const start = ${index} * chunkSize;
      const selected = specs.slice(start, start + chunkSize);
      fs.writeFileSync('chunk-specs-${index}.txt', selected.join('\\n'));
    "

    echo "Running specs for chunk ${index}:"
    cat chunk-specs-${index}.txt

    while IFS= read -r spec; do
      echo "Running spec: \$spec"
      xvfb-run --auto-servernum --server-args="-screen 0 1920x1080x24" \
        npx cypress run --browser chromium \
        --reporter mochawesome \
        --reporter-options "reportDir=cypress/results,overwrite=false,html=false,json=true" \
        --spec "\$spec"
        
      if [ \$? -ne 0 ]; then
        echo "⚠️ Test failed: \$spec"
        # Do not exit here — just continue to next spec
      fi
    done < chunk-specs-${index}.txt
  """
}
