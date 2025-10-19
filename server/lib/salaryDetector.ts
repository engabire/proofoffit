/**
 * Salary Detection and Parsing Engine
 * 
 * Detects salary ranges from job descriptions and text, supporting
 * multiple currencies ($, €, £) and units (hourly, monthly, annually).
 * Includes confidence scoring and unit inference.
 */

import type { SalaryRange } from "../../domain/jobs";

export interface SalaryDetectionResult {
  ranges: SalaryRange[];
  confidence: number;
  source: string;
  rawText: string;
}

export interface CurrencyConfig {
  symbol: string;
  code: string;
  name: string;
  defaultUnit: 'hourly' | 'monthly' | 'annually';
}

export class SalaryDetector {
  private readonly currencies: CurrencyConfig[] = [
    { symbol: '$', code: 'USD', name: 'US Dollar', defaultUnit: 'annually' },
    { symbol: '€', code: 'EUR', name: 'Euro', defaultUnit: 'annually' },
    { symbol: '£', code: 'GBP', name: 'British Pound', defaultUnit: 'annually' },
    { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', defaultUnit: 'annually' },
    { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', defaultUnit: 'annually' },
  ];

  private readonly unitPatterns = {
    hourly: /\b(per\s+hour|hourly|hr|/hr|per\s+hr)\b/i,
    monthly: /\b(per\s+month|monthly|/month|per\s+mo)\b/i,
    annually: /\b(per\s+year|yearly|annually|/year|per\s+annum|pa)\b/i,
  };

  private readonly numberPatterns = {
    // Matches numbers with commas, periods, and K/M suffixes
    withSuffix: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB])\b/i,
    // Matches regular numbers
    regular: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\b/g,
    // Matches ranges like "50,000-70,000" or "50k-70k"
    range: /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)\s*[-–—]\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)\b/i,
  };

  /**
   * Detect salary information from text
   */
  detectSalaries(text: string): SalaryDetectionResult {
    const ranges: SalaryRange[] = [];
    let confidence = 0;
    const source = 'text_parsing';

    // Clean and normalize text
    const cleanText = this.cleanText(text);
    
    // Look for salary patterns
    const patterns = [
      this.detectRangePatterns(cleanText),
      this.detectSingleValuePatterns(cleanText),
      this.detectStructuredPatterns(cleanText),
    ];

    // Combine all detected ranges
    for (const patternRanges of patterns) {
      ranges.push(...patternRanges);
    }

    // Calculate confidence based on detection quality
    confidence = this.calculateConfidence(ranges, cleanText);

    // Remove duplicates and sort by confidence
    const uniqueRanges = this.deduplicateRanges(ranges);

    return {
      ranges: uniqueRanges,
      confidence,
      source,
      rawText: text,
    };
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s$€£,.-]/g, ' ') // Remove special characters except currency symbols
      .trim();
  }

  private detectRangePatterns(text: string): SalaryRange[] {
    const ranges: SalaryRange[] = [];
    const rangeRegex = this.numberPatterns.range;

    let match;
    while ((match = rangeRegex.exec(text)) !== null) {
      const minValue = this.parseNumber(match[1], match[2]);
      const maxValue = this.parseNumber(match[3], match[4]);
      const currency = this.detectCurrency(text, match.index);
      const unit = this.detectUnit(text, match.index);

      if (minValue && maxValue && minValue < maxValue) {
        ranges.push({
          min: minValue,
          max: maxValue,
          currency: currency.code as any,
          unit: unit,
          confidence: this.calculateRangeConfidence(match[0], currency, unit),
          source: 'explicit',
        });
      }
    }

    return ranges;
  }

  private detectSingleValuePatterns(text: string): SalaryRange[] {
    const ranges: SalaryRange[] = [];
    
    // Look for patterns like "$50,000" or "€2,400"
    const currencyRegex = /([$€£])\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)/gi;
    
    let match;
    while ((match = currencyRegex.exec(text)) !== null) {
      const currencySymbol = match[1];
      const value = this.parseNumber(match[2], match[3]);
      const currency = this.currencies.find(c => c.symbol === currencySymbol);
      const unit = this.detectUnit(text, match.index);

      if (value && currency) {
        // For single values, create a range with ±10% variance
        const variance = value * 0.1;
        ranges.push({
          min: Math.round(value - variance),
          max: Math.round(value + variance),
          currency: currency.code as any,
          unit: unit,
          confidence: 0.7, // Lower confidence for single values
          source: 'inferred',
        });
      }
    }

    return ranges;
  }

  private detectStructuredPatterns(text: string): SalaryRange[] {
    const ranges: SalaryRange[] = [];
    
    // Look for structured patterns like "Salary: $50,000 - $70,000"
    const structuredPatterns = [
      /salary[:\s]+([$€£]?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)\s*[-–—]\s*([$€£]?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)/gi,
      /compensation[:\s]+([$€£]?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)\s*[-–—]\s*([$€£]?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)/gi,
      /pay[:\s]+([$€£]?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)\s*[-–—]\s*([$€£]?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)/gi,
    ];

    for (const pattern of structuredPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const minValue = this.parseNumber(match[2], match[3]);
        const maxValue = this.parseNumber(match[5], match[6]);
        const currency = this.detectCurrency(text, match.index);
        const unit = this.detectUnit(text, match.index);

        if (minValue && maxValue && minValue < maxValue) {
          ranges.push({
            min: minValue,
            max: maxValue,
            currency: currency.code as any,
            unit: unit,
            confidence: 0.9, // High confidence for structured patterns
            source: 'explicit',
          });
        }
      }
    }

    return ranges;
  }

  private parseNumber(value: string, suffix: string): number | null {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return null;

    const multiplier = this.getSuffixMultiplier(suffix);
    return Math.round(num * multiplier);
  }

  private getSuffixMultiplier(suffix: string): number {
    switch (suffix.toUpperCase()) {
      case 'K': return 1000;
      case 'M': return 1000000;
      case 'B': return 1000000000;
      default: return 1;
    }
  }

  private detectCurrency(text: string, position: number): CurrencyConfig {
    // Look for currency symbols near the position
    const context = text.substring(Math.max(0, position - 50), position + 50);
    
    for (const currency of this.currencies) {
      if (context.includes(currency.symbol)) {
        return currency;
      }
    }

    // Default to USD if no currency found
    return this.currencies[0];
  }

  private detectUnit(text: string, position: number): 'hourly' | 'monthly' | 'annually' {
    const context = text.substring(Math.max(0, position - 100), position + 100);
    
    for (const [unit, pattern] of Object.entries(this.unitPatterns)) {
      if (pattern.test(context)) {
        return unit as 'hourly' | 'monthly' | 'annually';
      }
    }

    // Default to annually if no unit found
    return 'annually';
  }

  private calculateRangeConfidence(
    match: string,
    currency: CurrencyConfig,
    unit: string
  ): number {
    let confidence = 0.8; // Base confidence

    // Increase confidence for explicit currency symbols
    if (match.includes(currency.symbol)) {
      confidence += 0.1;
    }

    // Increase confidence for explicit units
    if (unit !== 'annually') {
      confidence += 0.05;
    }

    // Increase confidence for K/M suffixes (indicates salary context)
    if (/\b[KMB]\b/i.test(match)) {
      confidence += 0.05;
    }

    return Math.min(1.0, confidence);
  }

  private calculateConfidence(ranges: SalaryRange[], text: string): number {
    if (ranges.length === 0) return 0;

    let totalConfidence = 0;
    for (const range of ranges) {
      totalConfidence += range.confidence;
    }

    const averageConfidence = totalConfidence / ranges.length;

    // Adjust based on context clues
    const contextBonus = this.getContextBonus(text);
    
    return Math.min(1.0, averageConfidence + contextBonus);
  }

  private getContextBonus(text: string): number {
    const salaryKeywords = [
      'salary', 'compensation', 'pay', 'wage', 'income',
      'benefits', 'package', 'total compensation', 'base salary'
    ];

    const keywordCount = salaryKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length;

    return Math.min(0.2, keywordCount * 0.05);
  }

  private deduplicateRanges(ranges: SalaryRange[]): SalaryRange[] {
    const unique: SalaryRange[] = [];
    
    for (const range of ranges) {
      const isDuplicate = unique.some(existing => 
        existing.min === range.min &&
        existing.max === range.max &&
        existing.currency === range.currency &&
        existing.unit === range.unit
      );

      if (!isDuplicate) {
        unique.push(range);
      }
    }

    // Sort by confidence (highest first)
    return unique.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Convert salary to annual equivalent for comparison
   */
  convertToAnnual(salary: SalaryRange): SalaryRange {
    if (salary.unit === 'annually') {
      return salary;
    }

    const multiplier = this.getAnnualMultiplier(salary.unit);
    
    return {
      min: Math.round(salary.min * multiplier),
      max: Math.round(salary.max * multiplier),
      currency: salary.currency,
      unit: 'annually',
      confidence: salary.confidence * 0.9, // Slight confidence reduction for conversion
      source: 'converted',
    };
  }

  private getAnnualMultiplier(unit: string): number {
    switch (unit) {
      case 'hourly': return 2080; // 40 hours/week * 52 weeks
      case 'monthly': return 12;
      case 'annually': return 1;
      default: return 1;
    }
  }

  /**
   * Check if a job posting lacks salary information (for pay transparency compliance)
   */
  lacksSalaryInformation(text: string): boolean {
    const result = this.detectSalaries(text);
    return result.ranges.length === 0 || result.confidence < 0.3;
  }

  /**
   * Get salary transparency compliance score
   */
  getTransparencyScore(text: string): {
    score: number;
    hasSalary: boolean;
    confidence: number;
    recommendations: string[];
  } {
    const result = this.detectSalaries(text);
    const hasSalary = result.ranges.length > 0 && result.confidence >= 0.5;
    
    let score = hasSalary ? 100 : 0;
    const recommendations: string[] = [];

    if (!hasSalary) {
      recommendations.push('Include salary range in job posting');
      recommendations.push('Consider pay transparency requirements in your jurisdiction');
    } else if (result.confidence < 0.7) {
      score = 70;
      recommendations.push('Make salary information more explicit and clear');
    }

    // Check for salary range (better than single value)
    const hasRange = result.ranges.some(range => range.min !== range.max);
    if (hasSalary && !hasRange) {
      score = Math.min(score, 80);
      recommendations.push('Consider providing a salary range instead of a single value');
    }

    return {
      score,
      hasSalary,
      confidence: result.confidence,
      recommendations,
    };
  }

  /**
   * Format salary range for display
   */
  formatSalaryRange(range: SalaryRange): string {
    const currencySymbol = this.currencies.find(c => c.code === range.currency)?.symbol || range.currency;
    const unitSuffix = range.unit === 'annually' ? '' : `/${range.unit}`;
    
    if (range.min === range.max) {
      return `${currencySymbol}${range.min.toLocaleString()}${unitSuffix}`;
    }
    
    return `${currencySymbol}${range.min.toLocaleString()} - ${currencySymbol}${range.max.toLocaleString()}${unitSuffix}`;
  }
}
