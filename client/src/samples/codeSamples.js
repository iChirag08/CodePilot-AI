export const CODE_SAMPLES = {
  javascript: {
    filename: "userAnalytics.js",
    language: "javascript",
    code: `// Process user metrics with intentional bugs & performance issues
async function fetchUserReport(userIds) {
  let results = [];
  
  // Bug 1: O(N^2) inefficient loop with global scope mutation
  for (i = 0; i < userIds.length; i++) {
    let id = userIds[i];
    
    // Bug 2: Unhandled async promise / missing await & try-catch
    fetch("https://api.analytics.internal/users/" + id)
      .then(res => res.json())
      .then(data => {
        // Bug 3: Potential Null pointer if data.metrics is undefined
        let score = data.metrics.score;
        results.push({ id, score });
      });
  }

  // Bug 4: Memory leak - registering event listener inside function without cleanup
  window.addEventListener('resize', function() {
    console.log("Resized for user ids:", userIds);
  });

  return results;
}

// Example invocation
fetchUserReport([101, 102, 103]);`
  },

  typescript: {
    filename: "paymentProcessor.ts",
    language: "typescript",
    code: `interface Transaction {
  id: string;
  amount: number;
  currency: string;
  user?: {
    email: string;
  };
}

class PaymentProcessor {
  private transactions: any[] = []; // Issue: any type bypasses TS safety

  public processBatch(batch: Transaction[]) {
    for (let i = 0; i <= batch.length; i++) { // Bug: Off-by-one index error
      const item = batch[i];
      
      // Bug: Accessing email without optional chaining check (TypeError)
      console.log("Processing payment for: " + item.user.email);
      
      if (item.amount == "100") { // Bug: Implicit type coercion comparison
        this.transactions.push(item);
      }
    }
  }
}

export default PaymentProcessor;`
  },

  python: {
    filename: "data_pipeline.py",
    language: "python",
    code: `# Data Pipeline with intentional bugs & performance bottlenecks

# Bug 1: Mutable default argument bug (cache retains state across calls!)
def process_user_data(data_list, cache={}):
    processed = []
    
    # Bug 2: Quadratic time complexity lookup O(N^2)
    for item in data_list:
        if item not in processed:
            # Bug 3: File resource leak (unclosed file handle!)
            f = open("log.txt", "a")
            f.write(f"Processing {item}\\n")
            
            # Bug 4: ZeroDivisionError risk when calculate_ratio is 0
            ratio = 100 / item['value']
            processed.append({'id': item['id'], 'ratio': ratio})
            
    return processed

# Example input with bug triggers
sample_data = [{'id': 1, 'value': 10}, {'id': 2, 'value': 0}]
result = process_user_data(sample_data)`
  },

  java: {
    filename: "OrderService.java",
    language: "java",
    code: `import java.io.*;
import java.util.*;

public class OrderService {

    // Bug 1: Unclosed resource leak (BufferedReader)
    public List<String> loadOrders(String filePath) throws IOException {
        List<String> orders = new ArrayList<>();
        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        String line;
        while ((line = reader.readLine()) != null) {
            orders.add(line);
        }
        // Missing reader.close() inside finally block!
        return orders;
    }

    // Bug 2: NullPointerException risk & inefficient String concatenation loop
    public String buildOrderSummary(List<Order> orderList) {
        String summary = "";
        for (Order order : orderList) {
            // Null pointer if order.getCustomer() is null
            summary += order.getCustomer().getName() + ", "; // O(N^2) string allocation
        }
        return summary;
    }
}`
  },

  cpp: {
    filename: "matrix_solver.cpp",
    language: "cpp",
    code: `#include <iostream>
#include <vector>

class MatrixSolver {
public:
    // Bug 1: Memory leak - raw dynamic array allocated with new[], never freed with delete[]
    int* computeTransform(int size) {
        int* buffer = new int[size];
        for (int i = 0; i <= size; i++) { // Bug 2: Buffer overflow! Out-of-bounds array access
            buffer[i] = i * 2;
        }
        return buffer;
    }

    // Bug 3: Returning reference to local stack variable (Dangling reference!)
    const std::string& getStatusMessage() {
        std::string status = "Computation Complete";
        return status; 
    }
};

int main() {
    MatrixSolver solver;
    int* result = solver.computeTransform(5);
    // Missing delete[] result! Memory leak occurs.
    return 0;
}`
  },

  sql: {
    filename: "optimize_queries.sql",
    language: "sql",
    code: `-- Unoptimized & Vulnerable SQL Query

-- Bug 1: SQL Injection vulnerability risk & SELECT * performance anti-pattern
SELECT * 
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.email = 'user@example.com' OR '1'='1' 
ORDER BY o.created_at DESC;

-- Bug 2: Function call on indexed column prevents index usage (Table Scan!)
SELECT user_id, amount 
FROM transactions 
WHERE YEAR(created_at) = 2026 
  AND status LIKE '%COMPLETED%';`
  }
};
