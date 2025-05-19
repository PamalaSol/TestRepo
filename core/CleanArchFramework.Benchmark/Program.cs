// See https://aka.ms/new-console-template for more information

using BenchmarkDotNet.Running;
using CleanArchFramework.Benchmark;

Console.WriteLine("Hello, World!");
var summary = BenchmarkRunner.Run<BenchmarkProductHandlers>();