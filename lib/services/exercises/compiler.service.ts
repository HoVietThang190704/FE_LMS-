import type { CompileRequest, CompileResponse, SubmissionResult, TestResult } from '@/lib/types/exercises';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_VERSIONS: Record<string, string> = {
  python: '3.10.0',
  java: '15.0.2',
  c: '10.2.0',
  cpp: '10.2.0',
  rust: '1.56.1',
};

const LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  rust: 'rust',
};

export const CODE_TEMPLATES: Record<string, string> = {
  python: `a = int(input())
b = int(input())
print(a + b)`,
  java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
  c: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
  rust: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let a: i32 = input.trim().parse().unwrap();
    
    input.clear();
    io::stdin().read_line(&mut input).unwrap();
    let b: i32 = input.trim().parse().unwrap();
    
    println!("{}", a + b);
}`,
};

async function executePracticeCode(language: string, code: string, input: string = ''): Promise<CompileResponse> {
  try {
    if (!language || !code) {
      return {
        success: false,
        output: '',
        error: 'Language and code are required',
      };
    }

    const pistonLang = LANGUAGE_MAP[language] || language;
    const version = LANGUAGE_VERSIONS[language] || '*';

    const payload = {
      language: pistonLang,
      version: version,
      files: [
        {
          content: code,
        },
      ],
      stdin: input || '',
      run_timeout: 10000,
    };

    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Piston API Error: ${response.status}`, errorText);

      if (response.status === 400) {
        return {
          success: false,
          output: '',
          error: 'Bad Request - Invalid code or input format',
        };
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    const stdout = result.run?.stdout || '';
    const stderr = result.run?.stderr || '';
    const exitCode = result.run?.code || 0;

    if (stderr && exitCode !== 0) {
      console.warn(`Execution error (exit code ${exitCode}):`, stderr);
      return {
        success: false,
        output: stdout.trim(),
        error: stderr,
      };
    }

    return {
      success: true,
      output: stdout.trim() || '',
      error: '',
    };
  } catch (error) {
    console.error('Piston API Exception:', error instanceof Error ? error.message : String(error));
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Execution error',
    };
  }
}

function validateTestOutput(actualOutput: string, expectedOutput: string): boolean {
  const actual = actualOutput.trim();
  const expected = expectedOutput.trim();

  if (actual === expected) return true;

  if (actual.replace(/\s+/g, ' ') === expected.replace(/\s+/g, ' ')) return true;

  const actualLines = actual.split('\n').map(l => l.trim()).filter(l => l);
  const expectedLines = expected.split('\n').map(l => l.trim()).filter(l => l);

  if (actualLines.length === expectedLines.length) {
    return actualLines.every((line, idx) => line === expectedLines[idx]);
  }

  return false;
}

export async function submitSolution(
  code: string,
  language: string,
  testCases: Array<{ input: string; expectedOutput: string; id: string }>
): Promise<SubmissionResult> {
  try {
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return {
        success: false,
        passedTests: 0,
        totalTests: 0,
        results: [],
        message: 'No test cases available',
      };
    }

    const results: TestResult[] = [];
    let passedTests = 0;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const input = testCase.input || '';
      const expectedOutput = testCase.expectedOutput || '';

      const result = await executePracticeCode(language, code, input);

      const passed = validateTestOutput(result.output || '', expectedOutput);
      if (passed) passedTests++;

      results.push({
        testCaseId: testCase.id,
        passed,
        expected: expectedOutput,
        actual: result.output || '',
        error: result.error || '',
      });
    }

    return {
      success: passedTests === testCases.length,
      passedTests,
      totalTests: testCases.length,
      results,
      message: passedTests === testCases.length ? 'All tests passed' : `${passedTests}/${testCases.length} tests passed`,
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      success: false,
      passedTests: 0,
      totalTests: testCases.length,
      results: [],
      message: error instanceof Error ? error.message : 'Execution error',
    };
  }
}

export function getCodeTemplate(language: string): string {
  return CODE_TEMPLATES[language] || CODE_TEMPLATES.python;
}
