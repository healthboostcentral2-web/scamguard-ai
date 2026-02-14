import { RiskLevel, ScanResult, DetectionRule } from '../types';

// Detection rules database
const SCAM_INDICATORS: DetectionRule[] = [
  // High Risk - Payment/Financial
  { pattern: /(?:pay|send|transfer)\s+(?:rs\.?|inr|money).*(?:upi|gpay|phonepe|paytm)/i, score: 30, reason: "Unsolicited request for UPI payment.", type: 'keyword' },
  { pattern: /(?:kyc|pan card|aadhaar).*(?:suspend|block|expire|update|link)/i, score: 50, reason: "Threatening KYC suspension or account blockage (Common Phishing).", type: 'keyword' },
  { pattern: /(?:lottery|winner|won|prize|lucky draw).*(?:crore|lakh|rupees)/i, score: 45, reason: "Too good to be true lottery claim.", type: 'keyword' },
  { pattern: /(?:electricity|power).*(?:disconnect|cut).*(?:tonight|pm|immediately)/i, score: 50, reason: "Urgent electricity disconnection threat.", type: 'keyword' },
  { pattern: /(?:refund|cashback).*(?:pending|credited).*(?:click|link)/i, score: 35, reason: "Fake refund or cashback promise to lure clicks.", type: 'keyword' },
  
  // Remote Access Scams
  { pattern: /(?:teamviewer|anydesk|quicksupport|rustdesk)/i, score: 60, reason: "Request to install remote access software (High Danger).", type: 'keyword' },
  
  // Suspicious Domains & Links
  { pattern: /\b(bit\.ly|tinyurl\.com|is\.gd|t\.co|goo\.gl|rb\.gy)\b/i, score: 20, reason: "Uses URL shortener to hide actual destination.", type: 'domain' },
  { pattern: /\b(\.xyz|\.top|\.club|\.online|\.info|\.vip)\b/i, score: 25, reason: "Uses a suspicious or cheap top-level domain.", type: 'domain' },
  { pattern: /ngrok\.io/i, score: 50, reason: "Uses tunneling service (often used by hackers).", type: 'domain' },
  
  // Urgency
  { pattern: /(?:immediately|urgent|within 24 hours|action required|verify now)/i, score: 15, reason: "Creates false sense of urgency.", type: 'behavior' },
  
  // Job Scams
  { pattern: /(?:part time|work from home|daily income|earn per day).*(?:whatsapp|telegram)/i, score: 35, reason: "Suspicious job offer asking for chat on messaging apps.", type: 'keyword' },
];

const SAFE_INDICATORS: DetectionRule[] = [
  { pattern: /(?:sbi\.co\.in|hdfcbank\.com|icicibank\.com|axisbank\.com|amazon\.in|flipkart\.com|gov\.in|nic\.in)/i, score: -40, reason: "Domain belongs to a known official entity.", type: 'domain' },
  { pattern: /^(?:\+91|0)?[6-9]\d{9}$/, score: -5, reason: "Standard Indian mobile number format (though still verify caller).", type: 'phone' },
];

export const analyzeContent = (text: string): ScanResult => {
  let score = 0;
  const reasons: string[] = [];
  const cleanText = text.trim();

  // Empty check
  if (!cleanText) {
    return {
      id: Date.now().toString(),
      text: '',
      timestamp: Date.now(),
      riskLevel: RiskLevel.SAFE,
      confidenceScore: 0,
      reasons: [],
      recommendations: []
    };
  }

  // Run Scam Rules
  SCAM_INDICATORS.forEach(rule => {
    if (rule.pattern.test(cleanText)) {
      score += rule.score;
      reasons.push(rule.reason);
    }
  });

  // Run Safe Rules
  SAFE_INDICATORS.forEach(rule => {
    if (rule.pattern.test(cleanText)) {
      score += rule.score;
      reasons.push(rule.reason);
    }
  });

  // Clamp Score
  score = Math.max(0, Math.min(100, score));

  // Determine Level
  let riskLevel = RiskLevel.SAFE;
  if (score >= 60) riskLevel = RiskLevel.SCAM;
  else if (score >= 30) riskLevel = RiskLevel.SUSPICIOUS;

  // Generate Recommendations
  const recommendations: string[] = [];
  if (riskLevel === RiskLevel.SCAM) {
    recommendations.push("Do NOT click any links.");
    recommendations.push("Block the sender immediately.");
    recommendations.push("Do NOT share OTP or PIN.");
    if (reasons.some(r => r.includes("remote access"))) {
      recommendations.push("Uninstall any app they asked you to download (AnyDesk, etc).");
    }
  } else if (riskLevel === RiskLevel.SUSPICIOUS) {
    recommendations.push("Verify the source via official website.");
    recommendations.push("Do not make any payments via links.");
    recommendations.push("Call the official customer care number found on Google.");
  } else {
    recommendations.push("Seems safe, but always stay vigilant.");
    recommendations.push("Never share passwords even if it looks real.");
  }

  return {
    id: Date.now().toString(),
    text: cleanText,
    timestamp: Date.now(),
    riskLevel,
    confidenceScore: score,
    reasons,
    recommendations,
  };
};