pipeline {
  agent any
  tools { nodejs 'Node22' }

  environment {
    CHROME_BIN = '/usr/bin/chromium'
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

          echo "Chromium version:"
          chromium --version || echo "❌ Chromium not found"
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
    node scripts/split-specs.js ${index} ${totalChunks}

    echo "Running specs for chunk ${index}:"
    cat chunk-specs-${index}.txt

    while IFS= read -r spec; do
      echo "Running spec: \$spec"
      xvfb-run --auto-servernum --server-args="-screen 0 1920x1080x24" \\
        npx cypress run --browser chromium \\
        --reporter mochawesome \\
        --reporter-options "reportDir=cypress/results,overwrite=false,html=false,json=true" \\
        --spec "\$spec" || echo "⚠️ Test failed: \$spec"
    done < chunk-specs-${index}.txt
  """
}
