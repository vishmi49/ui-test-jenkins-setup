pipeline {
  agent any
  tools { nodejs 'Node22' }

  environment {
    CHROME_BIN = '/usr/bin/google-chrome'
  }

  stages {

    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Install Chromium & Dependencies') {
      steps {
        sh '''#!/bin/bash
          echo "Installing Chromium and dependencies..."
          apt-get update && apt-get install -y \
            chromium chromium-driver \
            libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 \
            libxss1 libasound2 libxtst6 libxrandr2 x11-xkb-utils libglib2.0-0 \
            fonts-liberation libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 \
            libpango-1.0-0 libudev1 libxcomposite1 libxdamage1 libxext6 \
            libxfixes3 libxkbcommon0 xvfb

          ln -sf /usr/bin/chromium /usr/bin/google-chrome
        '''
      }
    }

    stage('Verify Environment') {
      steps {
        sh '''
          echo "Cypress version:"
          npx cypress --version || echo "❌ Cypress not found"

          echo "Spec files:"
          find . -name "*.spec.js" || echo "❌ No spec files found"

          echo "Chrome version:"
          google-chrome --version || echo "❌ Chrome not found"
        '''
      }
    }

    stage('Run Cypress Tests in Parallel') {
      parallel {
        stage('Chunk 1') {
          steps {
            script {
              runCypressChunk(0, 3)
            }
          }
        }
        stage('Chunk 2') {
          steps {
            script {
              runCypressChunk(1, 3)
            }
          }
        }
        stage('Chunk 3') {
          steps {
            script {
              runCypressChunk(2, 3)
            }
          }
        }
      }
    }

    stage('Merge Mochawesome Reports') {
      steps {
        script {
          sh 'mkdir -p cypress/reports'
          def reportFiles = sh(script: "ls cypress/results/mochawesome*.json 2>/dev/null | wc -l", returnStdout: true).trim()
          if (reportFiles != "0") {
            sh 'npx mochawesome-merge cypress/results/mochawesome*.json > cypress/reports/merged-reports.json'
          } else {
            echo "⚠️ No reports to merge"
            writeFile file: 'cypress/reports/merged-reports.json', text: '{"stats":{},"results":[]}'
          }
        }
      }
    }

    stage('Generate HTML Report') {
      steps {
        script {
          if (fileExists('cypress/reports/merged-reports.json')) {
            sh '''#!/bin/bash
              if grep -q '"results":\\[\\]' cypress/reports/merged-reports.json; then
                echo "⚠️ Empty test results, skipping report generation."
              else
                npx mochawesome-report-generator cypress/reports/merged-reports.json \
                  --reportDir=cypress/reports \
                  --reportFilename test-report.html
              fi
            '''
          }
        }
      }
    }

    stage('Archive Test Report') {
      steps {
        archiveArtifacts artifacts: 'cypress/reports/**', allowEmptyArchive: true
        archiveArtifacts artifacts: 'cypress_output_*.log', allowEmptyArchive: true
      }
    }

    stage('Cleanup Results Directory') {
      steps {
        sh 'rm -rf cypress/results/mochawesome*.json || echo "Nothing to clean."'
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}

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
        npx cypress run --browser chrome \
        --reporter mochawesome \
        --reporter-options "reportDir=cypress/results,overwrite=false,html=false,json=true" \
        --spec "\$spec"

      if [ \$? -ne 0 ]; then
        echo "❌ Test failed: \$spec"
        exit 1
      fi
    done < chunk-specs-${index}.txt
  """
}
